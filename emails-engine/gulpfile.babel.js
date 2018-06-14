import gulp     from 'gulp';
import plugins  from 'gulp-load-plugins';
import browser  from 'browser-sync';
import rimraf   from 'rimraf';
import panini   from 'panini';
import yargs    from 'yargs';
import lazypipe from 'lazypipe';
import inky     from 'inky';
import fs       from 'fs';
import siphon   from 'siphon-media-query';
import path     from 'path';
import merge    from 'merge-stream';
import beep     from 'beepbeep';
import colors   from 'colors';
import litmus   from 'gulp-litmus';
import gutil    from 'gulp-util';
import html2txt from 'gulp-html2txt';
import GulpSSH  from 'gulp-ssh';
import print    from 'gulp-print';
import nodemailer from 'nodemailer';
import slash    from 'slash';
import folderIndex from 'gulp-folder-index';
import inquirer from 'inquirer';
import through2 from 'through2';

const $ = plugins();

// Look for the --production flag
const PRODUCTION = !!(yargs.argv.production);
const CLIENT = (yargs.argv.client !== undefined) ? yargs.argv.client.split("/")[0] : undefined;
const PROJECT = (yargs.argv.client.split("/")[1] !== undefined) ? yargs.argv.client.split("/")[1] : undefined;
const TARGET = CLIENT+'/'+PROJECT;
const EMAIL = yargs.argv.to;
const CLOUD_BASE_URL = 'http://cloud.cross-systems.ch/w/emails/'

// Declar var so that both AWS and Litmus task can use it.
var CONFIG;
console.log(TARGET.toUpperCase())

let gulpSSH;
let emailsTemplatesToSend;
let receivers;

// Email Config
const smtpInfo = {
  auth: {
    user: 'widebetatesteur@gmail.com',
    pass: '1+password'
  },
  host: 'smtp.gmail.com',
  secureConnection: false,
  port: 587
};

/**
 * Gulp commands
 */

// Build the "dist" folder by running all of the below tasks
gulp.task('build',
  gulp.series(clean, pages, sass, images, fonts, totext, inline)
);

// Build emails, run the server, and watch for file changes
gulp.task('default',
  gulp.series('build', server, watch)
);

// Builds emails and online versions
gulp.task('build-online',
  gulp.series('build', createOnlineVersion)
);

// Build emails, upload assets to ftp and replace link
gulp.task('cdn',
  gulp.series('build-online', creds, createImgFolder, createFontFolder, uploadOnlineVersion, uploadImg, uploadFont, replaceImgLink, replaceFontLink, displayLinks)
);

// Build emails, then zip
gulp.task('zip',
  gulp.series('build', zip)
);

// Send emails throught emails
gulp.task('mail',
  gulp.series('cdn', askForMailsToSend, askForReceivers, sendEmails)
);

// Send emails to Litmus
gulp.task('litmus',
  gulp.series('cdn', sendToLitmus)
);

/**
 * Gulp tasks
 */

// Delete the "dist" folder
// This happens every time a build starts
function clean(done) {
  rimraf('dist/'+TARGET, done);
}

// Compile layouts, pages, and partials into flat HTML files
// Then parse using Inky templates
function pages() {
  moveIndexPage();

  return gulp.src(['src/clients/'+TARGET+'/pages/*.html', '!src/clients/archive/**/*.html'])
    .pipe(panini({
      root: 'src/clients/'+TARGET+'/pages',
      layouts: 'src/clients/'+TARGET+'/layouts',
      partials: [
        'src/clients/'+CLIENT+'/partials',
        'src/clients/'+TARGET+'/partials'
      ],
      helpers: 'src/helpers',
      data: 'src/clients/'+TARGET+'/data'
    }))
    .pipe(inky())
    .pipe(gulp.dest('dist/'+TARGET));
}

function moveIndexPage() {
  return gulp.src(['src/clients/index.html'])
    .pipe(gulp.dest('dist'));
}

function createUrlsJson(){
  console.log('UrlsJson was created > dist/'+TARGET+'/*.html')
  gulp.src('dist/**/**/*.html')
  .pipe(folderIndex({
    extension: '.html',       // default
    filename: 'urls.json',   // default
    prefix: '',               // default
    directory: false          // default
  }))
  .pipe(gulp.dest('dist'));
}

// Reset Panini's cache of layouts and partials
function resetPages(done) {
  panini.refresh();
  done();
}

// Compile Sass into CSS
function sass() {
  return gulp.src('src/clients/'+TARGET+'/scss/app_'+CLIENT+'_'+PROJECT+'.scss')
    .pipe($.if(!PRODUCTION, $.sourcemaps.init()))
    .pipe($.sass({
      includePaths: ['node_modules/foundation-emails/scss']
    }).on('error', $.sass.logError))
    .pipe($.if(PRODUCTION, $.uncss(
      {
        html: ['dist/'+TARGET+'/*.html']
      })))
    .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe(gulp.dest('dist/'+TARGET+'/css'));
}

// Copy and compress images
function images() {
  return gulp.src(['src/clients/'+TARGET+'/images/**/*', '!src/assets/images/archive/**/*'])
    .pipe($.imagemin())
    .pipe(gulp.dest('./dist/'+TARGET+'/images'));
}

// Copy fonts
function fonts() {
  return gulp.src(['src/clients/'+TARGET+'/fonts/**/*'])
    .pipe(gulp.dest('./dist/'+TARGET+'/fonts'));
}

// Inline CSS and minify HTML
function inline() {
  return gulp.src('dist/'+TARGET+'/*.html')
    .pipe($.if(PRODUCTION, inliner('dist/'+TARGET+'/css/app_'+CLIENT+'_'+PROJECT+'.css')))
    .pipe(gulp.dest('dist/'+TARGET));
}

// Start a server with LiveReload to preview the site in
function server(done) {
  browser.init({
    server: 'dist'
  });
  done();
}

// Watch for file changes
function watch() {
  gulp.watch([
    'src/clients/'+TARGET+'/pages/**/*.html',
    'src/clients/'+TARGET+'/partials/**/*.html'
  ]).on('all', gulp.series(resetPages, pages, inline, browser.reload));
  gulp.watch([
    'src/clients/'+TARGET+'/layouts/**/*',
    'src/clients/'+CLIENT+'/partials/**/*', 'src/clients/'+TARGET+'/data/**/*'
  ]).on('all', gulp.series(resetPages, pages, inline, browser.reload));
  gulp.watch([
    'src/clients/'+TARGET+'/scss/**/*.scss',
    'src/clients/'+CLIENT+'/scss/**/*.scss'
  ]).on('all', gulp.series(resetPages, sass, pages, inline, browser.reload));
  gulp.watch('src/clients/'+TARGET+'/images/**/*').on('all', gulp.series(images, browser.reload));

  createUrlsJson();
}

// Inlines CSS into HTML, adds media query CSS into the <style> tag of the email, and compresses the HTML
function inliner(css) {
  var css = fs.readFileSync(css).toString();
  var mqCss = siphon(css);

  var pipe = lazypipe()
    .pipe($.inlineCss, {
      applyStyleTags: false,
      removeStyleTags: false,
      preserveMediaQueries: true,
      removeLinkTags: false
    })
    .pipe($.replace, '&#x3D;', '=')
    .pipe($.replace, '<!-- <style> -->', `<style>${css}</style>`)
    .pipe($.replace, '<link rel="stylesheet" type="text/css" href="css/app_'+CLIENT+'_'+PROJECT+'.css">', '')
    //.pipe($.htmlmin, {
    //  collapseWhitespace: true,
    //  minifyCSS: true
    //});

  return pipe();
}

// Generate text from HTML
function totext(){
  var options = {
      ignoreImage: true
  };

  return gulp.src('dist/'+TARGET+'/*.html')
    .pipe(html2txt(options))
    .pipe(gulp.dest('dist/'+TARGET+'/plain_text'));
}

// Ensure creds for Litmus are at least there.
function creds(done) {
  var configPath = './config.json';
  try {
    CONFIG = JSON.parse(fs.readFileSync(configPath));

    gulpSSH = new GulpSSH({
      ignoreErrors: false,
      sshConfig: {
        host:     CONFIG.ftp.host,
        user:     CONFIG.ftp.user,
        password: CONFIG.ftp.pass,
      }
    });
  }
  catch(e) {
    beep();
    console.log('[AWS]'.bold.red + ' Sorry, there was an issue locating your config.json. Please see README.md');
    process.exit();
  }
  done();
}

// copy assets to server
function uploadImg() {
  // envois img
  return gulp.src('dist/'+TARGET+'/images/**')
    .pipe(gulpSSH.dest(CONFIG.ftp.remotePath+TARGET+'/images/'));
}

// copy fonts to server
function uploadFont() {
  return gulp.src('dist/'+TARGET+'/fonts/**')
    .pipe(gulpSSH.dest(CONFIG.ftp.remotePath+TARGET+'/fonts/'))
}

function createOnlineVersion() {
    return gulp.src('dist/'+TARGET+'/*.html')
      .pipe($.replace('onlineLink', 'bg-mobile'))
      .pipe(gulp.dest('dist/'+TARGET+'/online_version'));
}

function uploadOnlineVersion() {
  // envoi des version online
  return gulp.src('dist/'+TARGET+'/online_version/*.html')
    .pipe(gulpSSH.dest(CONFIG.ftp.remotePath+TARGET+'/'));
}

// create img folder on server
function createImgFolder() {
  return gulpSSH.exec([`if ! [ -d ${CONFIG.ftp.remotePath+TARGET+'/images/'} ]; then mkdir -p ${CONFIG.ftp.remotePath+TARGET+'/images/'}; fi`])
}

// create font folder on server
function createFontFolder() {
  var gulpSSH = new GulpSSH({
    ignoreErrors: false,
    sshConfig: {
      host:     CONFIG.ftp.host,
      user:     CONFIG.ftp.user,
      password: CONFIG.ftp.pass,
    }
  });

  return gulpSSH.exec([`if ! [ -d ${CONFIG.ftp.remotePath+TARGET+'/fonts/'} ]; then mkdir -p ${CONFIG.ftp.remotePath+TARGET+'/fonts/'}; fi`])
}

// replace img by the ones in the cdn
function replaceImgLink() {
  var cdnUrl = CONFIG.ftp.url + '/'+TARGET+'/images';
  // var cdnUrl = CONFIG.ftp.url;
  // replace html d dist
  return gulp.src('dist/'+TARGET+'/*.html')
    .pipe($.if(!!cdnUrl, $.replace(/background=('|")(.?\/?images)/g, "background=$1"+ cdnUrl)))
    .pipe($.if(!!cdnUrl, $.replace(/src=('|")(.?\/?images)/g, "src=$1"+ cdnUrl)))
    .pipe($.if(!!cdnUrl, $.replace(/url[(](\/?..\/images)/g, "url("+ cdnUrl)))
    .pipe(gulp.dest('dist/'+TARGET));
}

// replace fonts by the ones in the cdn
function replaceFontLink() {
  var cdnUrl = CONFIG.ftp.url + '/'+TARGET+'/fonts';
  // replace html d dist
  return gulp.src('dist/'+TARGET+'/*.html')
    .pipe($.if(!!cdnUrl, $.replace(/url[(]("\/?(..\/)?fonts)/g, "url(\""+ cdnUrl)))
    .pipe(gulp.dest('dist/'+TARGET));
}

// Copy and compress into Zip
function zip() {
  return gulp.src('dist/'+TARGET+'/**/*')
    .pipe($.zip(CLIENT+'_'+PROJECT+'.zip'))
    .pipe(gulp.dest('dist'));
}

async function askForMailsToSend() {
  const emails = fs.readdirSync('dist/'+TARGET).filter(file => file.endsWith('.html'))

  await inquirer.prompt([{
    type: 'checkbox',
    message: 'Which emails template do you want to send?',
    name: 'emailsTemplates',
    choices: emails
  }]).then((answers) => {
    emailsTemplatesToSend = answers.emailsTemplates.map(emailTemplate => 'dist/'+TARGET+'/'+emailTemplate)
  });
}

async function askForReceivers() {
  await inquirer.prompt([{
    type: 'checkbox',
    message: 'To which you want to send the emails?',
    name: 'receivers',
    choices: () => {
      return CONFIG.mail.to.sort()
    }
  }]).then((answers) => {
    receivers = answers.receivers.map(receiver => receiver.match(/<(.*)>/)[1])
  });
}

// Send emails
function sendEmails() {
  return gulp.src(emailsTemplatesToSend)
    .pipe(through2.obj(async (file, enc, next) => {
      const transporter = nodemailer.createTransport(smtpInfo);
      const html = file.contents.toString();
      const subject = decodeURI(html.match(/<title.*?>(.*)<\/title>/)[1])
        .replace(new RegExp("&"+"#"+"x27;", "g"), "'");

      for (let receiver of receivers) {
        const subjectPrefix = (receiver.includes('@wideagency.com') ? '[EMAILS-ENGINE] ': '');

        await transporter.sendMail({
          from: CONFIG.mail.from,
          to: receiver,
          subject: subjectPrefix + subject,
          generateTextFromHTML: true,
          html: html
        }).then(info => {
          gutil.log('Send email', gutil.colors.cyan(subjectPrefix + subject), 'to', gutil.colors.red(receiver));
        }).catch(error => {
          if (error) {
            console.error(error);
            transporter.close();

            return next();
          }
        });
      }

      transporter.close();
      next();
    }));
}

// Send emails to Litmus
function sendToLitmus() {
  return gulp.src('dist/'+TARGET+'/*.html')
      .pipe(litmus(CONFIG.litmus))
      .pipe(gulp.dest('dist'));
}

// Display cloud's links to the console
function displayLinks() {
  return gulp.src('dist/'+TARGET+'/*.html')
    .pipe(print(filepath => {
      // Get the file name
      let fileName = path.basename(filepath);

      // Remove index from the file name and the extension
      fileName = fileName.replace(/index-|\.html/gi, '');

      // Replace all - to space
      fileName = fileName.replace(/-/gi, ' ');

      // Capitalize words
      fileName = fileName.replace(/\b\w/g, string => string.toUpperCase());

      // Normalize slash on every platform
      let url = slash(`${fileName}: ${CLOUD_BASE_URL}${filepath}`);

      // Remove dist from the filepath and return the url
      return url.replace('dist/', '');
    }))
}
