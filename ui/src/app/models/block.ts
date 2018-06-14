export class Block {
    name: string;
    displayName: string;
    thumbnailUrl: string;
    properties: BlockProperty[];
}

class BlockProperty {
    name: string;
    displayName: string;
    type: string;
    required: boolean;
}

/*enum BlockPropertyTypes {
    text = 'text',
    date = 'date',
    textarea = 'textarea',
    number = 'number',
    url = 'url',
    file = 'file',
    color = 'color'
}*/
