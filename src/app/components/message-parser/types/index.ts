export interface MessageParserClassNames {
    root?: string;
    paragraph?: string;
    h1?: string;
    h2?: string;
    h3?: string;
    h4?: string;
    h5?: string;
    h6?: string;
    strong?: string;
    em?: string;
    del?: string;
    code?: string;
    codeBlock?: string;
    codeBlockHeader?: string;
    codeBlockBody?: string;
    codeBlockLanguage?: string;
    codeBlockCopyButton?: string;
    blockquote?: string;
    hr?: string;
    ul?: string;
    ol?: string;
    li?: string;
    table?: string;
    tableWrapper?: string;
    thead?: string;
    tbody?: string;
    tr?: string;
    th?: string;
    td?: string;
    link?: string;
    image?: string;
    imageWrapper?: string;
    taskList?: string;
    taskItem?: string;
    taskCheckbox?: string;
    inlineCode?: string;
    footnote?: string;
    details?: string;
    summary?: string;
    kbd?: string;
    mark?: string;
    mathBlock?: string;
    mathInline?: string;
    callout?: string;
    calloutTitle?: string;
    calloutBody?: string;
    badge?: string;
    button?: string;
    divider?: string;
}

export interface MessageParserComponents {
    Paragraph?: React.ComponentType<ParagraphProps>;
    Heading?: React.ComponentType<HeadingProps>;
    CodeBlock?: React.ComponentType<CodeBlockProps>;
    InlineCode?: React.ComponentType<InlineCodeProps>;
    Blockquote?: React.ComponentType<BlockquoteProps>;
    Table?: React.ComponentType<TableProps>;
    Link?: React.ComponentType<LinkProps>;
    Image?: React.ComponentType<ImageProps>;
    List?: React.ComponentType<ListProps>;
    ListItem?: React.ComponentType<ListItemProps>;
    HorizontalRule?: React.ComponentType<HorizontalRuleProps>;
    TaskList?: React.ComponentType<TaskListProps>;
    Callout?: React.ComponentType<CalloutProps>;
    Kbd?: React.ComponentType<KbdProps>;
    Mark?: React.ComponentType<MarkProps>;
    Badge?: React.ComponentType<BadgeProps>;
    Button?: React.ComponentType<ButtonProps>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: React.ComponentType<any> | undefined;
}

export interface ParagraphProps {
    children: React.ReactNode;
    className?: string;
}

export interface HeadingProps {
    level: 1 | 2 | 3 | 4 | 5 | 6;
    children: React.ReactNode;
    id?: string;
    className?: string;
}

export interface CodeBlockProps {
    code: string;
    language?: string;
    filename?: string;
    showLineNumbers?: boolean;
    className?: string;
    classNames?: Pick<MessageParserClassNames, "codeBlock" | "codeBlockHeader" | "codeBlockBody" | "codeBlockLanguage" | "codeBlockCopyButton">;
}

export interface InlineCodeProps {
    children: React.ReactNode;
    className?: string;
}

export interface BlockquoteProps {
    children: React.ReactNode;
    className?: string;
}

export interface TableProps {
    headers: string[];
    rows: string[][];
    className?: string;
    classNames?: Pick<MessageParserClassNames, "table" | "tableWrapper" | "thead" | "tbody" | "tr" | "th" | "td">;
}

export interface LinkProps {
    href: string;
    children: React.ReactNode;
    external?: boolean;
    className?: string;
}

export interface ImageProps {
    src: string;
    alt?: string;
    title?: string;
    className?: string;
    classNames?: Pick<MessageParserClassNames, "image" | "imageWrapper">;
}

export interface ListProps {
    ordered: boolean;
    children: React.ReactNode;
    start?: number;
    className?: string;
}

export interface ListItemProps {
    children: React.ReactNode;
    checked?: boolean | null;
    className?: string;
}

export interface HorizontalRuleProps {
    className?: string;
}

export interface TaskListProps {
    items: Array<{ checked: boolean; content: React.ReactNode }>;
    className?: string;
    classNames?: Pick<MessageParserClassNames, "taskList" | "taskItem" | "taskCheckbox">;
}

export interface CalloutProps {
    type: "info" | "warning" | "error" | "success" | "note" | "tip";
    title?: string;
    children: React.ReactNode;
    className?: string;
    classNames?: Pick<MessageParserClassNames, "callout" | "calloutTitle" | "calloutBody">;
}

export interface KbdProps {
    children: React.ReactNode;
    className?: string;
}

export interface MarkProps {
    children: React.ReactNode;
    className?: string;
}

export interface BadgeProps {
    children: React.ReactNode;
    variant?: "default" | "success" | "warning" | "error" | "info";
    className?: string;
}

export interface ButtonProps {
    children: React.ReactNode;
    href?: string;
    onClick?: () => void;
    variant?: "primary" | "secondary" | "ghost";
    className?: string;
}

export interface MessageParserProps {
    content: string;
    classNames?: MessageParserClassNames;
    components?: MessageParserComponents;
    className?: string;
    streaming?: boolean;
    onLinkClick?: (href: string) => void;
}