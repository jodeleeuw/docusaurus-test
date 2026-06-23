import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import ExperimentDemo from '@site/src/components/ExperimentDemo';
import HeroBrain from '@site/src/components/HeroBrain';

import styles from './index.module.css';

const D = '/docs/current';

function Hero() {
  return (
    <header className={styles.hero}>
      <HeroBrain />
      <div className="container">
        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <Heading as="h1" className={styles.title}>
              Build behavioral experiments that run in the browser
            </Heading>
            <p className={styles.subtitle}>
              jsPsych is a free, open-source JavaScript framework for the
              behavioral sciences. Compose experiments from ready-made plugins,
              run them in any browser, and collect precise response-time data.
            </p>
            <div className={styles.ctaRow}>
              <Link
                className={styles.primaryCta}
                to={`${D}/getting-started/hello-world`}>
                Get started
              </Link>
              <Link
                className={styles.secondaryCta}
                to={`${D}/reference/plugins`}>
                Browse the plugins
              </Link>
            </div>
            <p className={styles.metaline}>
              Open source · Runs anywhere · Millisecond timing
            </p>
          </div>

          <div className={styles.heroDemo}>
            <ExperimentDemo />
          </div>
        </div>
      </div>
    </header>
  );
}

function Explainer() {
  return (
    <section className={styles.explain}>
      <div className="container">
        <div className={styles.explainInner}>
          <Heading as="h2" className={styles.sectionTitle}>
            One framework, assembled from plugins
          </Heading>
          <p className={styles.explainLead}>
            Each <Link to={`${D}/learn/concepts/plugins`}>plugin</Link>{' '}
            defines one kind of event — show an image, play a sound, record
            which key was pressed and when. You arrange plugins on a{' '}
            <Link to={`${D}/learn/concepts/timeline`}>timeline</Link>{' '}
            to build a procedure. Use the plugins bundled with jsPsych, community
            plugins from jspsych-contrib, or write your own.
          </p>
          <dl className={styles.concepts}>
            <div className={styles.concept}>
              <dt>Plugins</dt>
              <dd>Prebuilt trial types for presenting stimuli and collecting responses.</dd>
            </div>
            <div className={styles.concept}>
              <dt>Timeline</dt>
              <dd>Order, loop, and randomize trials into a complete experiment.</dd>
            </div>
            <div className={styles.concept}>
              <dt>Data</dt>
              <dd>Every response and reaction time, recorded and ready to export.</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}

type Path = {
  to: string;
  title: string;
  desc: string;
  feature?: boolean;
};

const PATHS: Path[] = [
  {
    to: `${D}/getting-started/hello-world`,
    title: 'Get started',
    desc: 'Install jsPsych and build your first experiment in about five minutes.',
    feature: true,
  },
  {
    to: `${D}/learn`,
    title: 'Learn',
    desc: 'Guides and step-by-step tutorials for designing and running studies.',
  },
  {
    to: `${D}/reference/core`,
    title: 'Reference',
    desc: 'The complete API for the core library, plugins, and extensions.',
  },
  {
    to: `${D}/reference/plugins`,
    title: 'Plugin catalog',
    desc: 'Every trial type you can drop straight onto a timeline.',
  },
  {
    to: `${D}/community/support`,
    title: 'Community',
    desc: 'Get help, report issues, and contribute back to the project.',
  },
];

function Paths() {
  return (
    <section className={styles.paths}>
      <div className="container">
        <Heading as="h2" className={styles.sectionTitle}>
          Find your way around
        </Heading>
        <ul className={styles.pathList}>
          {PATHS.map((p) => (
            <li
              key={p.to}
              className={p.feature ? styles.pathFeature : styles.pathItem}>
              <Link className={styles.pathLink} to={p.to}>
                <span className={styles.pathTitle}>
                  {p.title}
                  <span aria-hidden="true" className={styles.pathArrow}>
                    →
                  </span>
                </span>
                <span className={styles.pathDesc}>{p.desc}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default function Home(): ReactNode {
  return (
    <Layout
      title="Behavioral experiments in the browser"
      description="jsPsych is a free, open-source JavaScript framework for building behavioral experiments that run in a web browser.">
      <Hero />
      <main>
        <Explainer />
        <Paths />
      </main>
    </Layout>
  );
}
