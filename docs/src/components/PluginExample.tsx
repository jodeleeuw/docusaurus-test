import { ReactElement } from 'react';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import Details from '@theme/Details';
import CodeBlock from '@theme/CodeBlock';

type PluginExampleTabProps = {
  label: string;
  content: string;
};

type PluginExampleProps = {
  summary: string;
  tabProps: PluginExampleTabProps[];
};

const ExampleCode = ({ code }: { code: string }): ReactElement => (
  <CodeBlock 
    language="javascript"       
  >
    {code}
  </CodeBlock>
);

const ExampleDemo = ({ src }: { src: string }): ReactElement => (
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

function TabContent({ label, content }: PluginExampleTabProps): ReactElement {
  if (label === 'Code') {
    return <ExampleCode code={content} />;
  }
  if (label === 'Demo') {
    return <ExampleDemo src={content} />;
  };
  return <div>{content}</div>;
}

// maybe using setState(null) = [tabItem, setTabItem] could be useful for state management

export function PluginExample({ summary, tabProps }: PluginExampleProps): ReactElement {
  return (
    <Details summary={summary}>
      <Tabs>
        {tabProps.map((tabProp) => (
          <TabItem
            key={tabProp.label.toLowerCase()}
            value={tabProp.label.toLowerCase()}
            label={tabProp.label}
          >
            <TabContent label={tabProp.label} content={tabProp.content} />
          </TabItem>
        ))}
      </Tabs>
    </Details>
  );
}

export default PluginExample;