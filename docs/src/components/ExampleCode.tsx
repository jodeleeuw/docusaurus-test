import CodeBlock from '@theme/CodeBlock';
import { JSX } from 'react/jsx-dev-runtime';

export function ExampleCode({ code }: { code: string }): JSX.Element {
    return (
        <CodeBlock 
            language="javascript"       
        >
            {code}
        </CodeBlock>
    );
}