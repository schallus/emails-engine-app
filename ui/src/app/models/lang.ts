export class Lang {
    code: string;
    name: string;
    nativeName?: string;
}

export class LangSelected extends Lang {
    selected: boolean;
}
