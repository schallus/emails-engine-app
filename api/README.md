# Email Engine REST API
This is the email engine REST API developped for WIDE Switzerland.

GET /api/v1/brands(?name=x) Retourne la liste des marques filtré par nom.
SUCCESS 200
ERROR 500, Timeout

GET /api/v1/brands/%brand_slug%/campaigns(?page=x&pageSize=y&name=z) // Retourne la liste des campagnes de la marque.
SUCCESS 200
ERROR 500, Timeout, %brand_slug% does not exist

GET /api/v1/brands/%brand_slug%/campaigns/%campaign_slug% 
RESPONSE
{
	name: 'test',
	languages: ['fr', 'de', 'en', 'it'],
	subjects: [
		{lang: 'fr', text: 'Sujet FR'},
		{lang: 'de', text: 'Sujet DE'},
		...
	],
	recipients: [
		{fullname: 'Florian Sulliger', email: 'fsulliger@wideagency.com'},
		{fullname: 'Florian Schaller', email: 'flo.schaller@gmail.com'},
	]
	layout: 'default'
}

POST /api/v1/brands/%brand_slug%/campaigns // Crée une nouvelle campagnes
BODY PARAMETERS
{
	name: 'test',
	languages: ['fr', 'de', 'en', 'it'],
	subjects: [
		{lang: 'fr', text: 'Sujet FR'},
		{lang: 'de', text: 'Sujet DE'},
		...
	],
	layout: 'default'
}
Create /pages/index-fr.html, /pages/index-de.html, etc.

POST /api/v1/brands/%brand_slug%/campaigns/%campaign_slug%/lang
BODY PARAMETERS
{
	name: 'Français',
	abbr: 'FR'
}

DELETE /api/v1/brands/%brand_slug%/campaigns/%campaign_slug%

POST /api/v1/brands/%brand_slug%/campaigns/%campaign_slug%/clone // Duplique une campagne
BODY PARAMETERS new_name


GET /api/v1/brands/%brand_slug%/components Retourne la liste de blocs disponible

POST /api/v1/brands/%brand_slug%/campaigns/%campaign_slug%/compile
RESPONSE
{
	previews: [
		{lang: 'fr', url: 'http://previewurl.com/fr'},
		{lang: 'de', url: 'http://previewurl.com/de'},
		...
	]
}

POST /api/v1/brands/%brand_slug%/campaigns/%campaign_slug%/send
BODY PARAMETERS
{
	languages: [
		'fr', 'de', 'it'
	],
	recipients: [
		'fsulliger@wideagency.com',
		...
	]
}



