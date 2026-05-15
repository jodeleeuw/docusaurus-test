
import { JSX } from 'react/jsx-dev-runtime';

export function ExampleDemo({ src }: { src: string }): JSX.Element {
    return (
        <>
        <iframe 
            src={src} 
            width="90%;"
            height="500px;" 
            frameBorder="0"
        >
        </iframe>
        <a 
            target="_blank" 
            rel="noopener noreferrer" 
            href={src}
        >
            Open demo in new tab
        </a>
        </>
    );
}

export default ExampleDemo;