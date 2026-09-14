import { createClient } from '@sanity/client';
import * as path from 'path';
import * as dotenv from 'dotenv';

const studioEnv = dotenv.config({ path: path.resolve(__dirname, '../.env.local') }).parsed || {};
const rootEnv = dotenv.config({ path: path.resolve(__dirname, '../../.env.local') }).parsed || {};
Object.assign(process.env, rootEnv, studioEnv);

const PROJECT_ID = 'eeee8ze4';
const DATASET = 'production';
const API_VERSION = '2024-01-01';

const U = (id: string) => `https://images.unsplash.com/photo-${id}?w=800&h=450&fit=crop&auto=format`;

// Correct IDs matching seed.ndjson
const TRAINING_PROGRAM_IMAGES: Record<string, string> = {
  'program-data-privacy-fundamentals':    U('1550751827-4bd374c3f58b'),
  'program-workplace-safety-essentials':  U('1504307651254-35680f356dfd'),
  'program-financial-compliance-aml':     U('1554224155-6726b3ff858f'),
  'program-cybersecurity-awareness':      U('1550751827-4bd374c3f58b'),
  'program-preventing-workplace-harassment': U('1573497019940-1c28c88b4f3e'),
  'program-anti-corruption-bribery':      U('1589994965851-a8f479c573a9'),
  'program-diversity-equity-inclusion':   U('1522202176988-66273c2fd55f'),
  'program-gdpr-deep-dive':              U('1614064641938-3bbee52942c7'),
  'program-chemical-safety-hazmat':       U('1532094349884-543bc11b234d'),
  'program-insider-trading-prevention':   U('1611974789855-9c2a0a7236a3'),
};

const TRAINER_IMAGES: Record<string, string> = {
  'trainer-sarah-chen':        U('1573496359142-b8d87734a5a2'),
  'trainer-james-rodriguez':   U('1560250097-0b93528c311a'),
  'trainer-emily-watson':      U('1580489944761-15a19d654956'),
  'trainer-michael-okonkwo':   U('1507003211169-0a1dd7228f2d'),
  'trainer-priya-sharma':      U('1531123897727-8f129e1688ce'),
  'trainer-david-kim':         U('1472099645785-5658abf4ff4e'),
};

const LESSON_IMAGES: Record<string, string> = {
  'lesson-dp-01-understanding-personal-data':      U('1563013544-824ae1b704d3'),
  'lesson-dp-02-data-processing-principles':        U('1551288049-bebda4e38f71'),
  'lesson-dp-03-data-subject-rights':               U('1589578228447-e1a4e481c6c8'),
  'lesson-dp-04-data-breach-notification':          U('1555949963-aa79dcee981c'),
  'lesson-ws-01-hazard-identification':             U('1581092160607-ee22621dd758'),
  'lesson-ws-02-emergency-procedures':              U('1521791136064-7986c2920216'),
  'lesson-ws-03-personal-protective-equipment':     U('1504307651254-35680f356dfd'),
  'lesson-ws-04-ergonomics-workplace':              U('1593642632559-0c6d3fc62b89'),
  'lesson-fc-01-anti-money-laundering':             U('1554224155-6726b3ff858f'),
  'lesson-fc-02-know-your-customer':                U('1556742049-0cfed4f6a45d'),
  'lesson-fc-03-sanctions-compliance':              U('1526304640581-d334cdbbf45e'),
  'lesson-fc-04-fraud-prevention':                  U('1563013544-824ae1b704d3'),
  'lesson-wh-01-understanding-harassment':          U('1521737711867-e3b97375f902'),
  'lesson-wh-02-bystander-intervention':            U('1529156069898-49953e39b3ac'),
  'lesson-wh-03-reporting-investigation':           U('1450101499163-c8848c66ca85'),
  'lesson-ca-01-phishing-prevention':               U('1601597111158-2fceff292cdc'),
  'lesson-ca-02-password-security':                 U('1614064641938-3bbee52942c7'),
  'lesson-ca-03-data-protection-practices':         U('1550751827-4bd374c3f58b'),
  'lesson-ca-04-incident-response':                 U('1517048676732-d65bc937f952'),
  'lesson-ac-01-foreign-corruption-practices':      U('1589994965851-a8f479c573a9'),
  'lesson-ac-02-gifts-entertainment':               U('1512314889357-e157c22f938d'),
  'lesson-ac-03-conflict-of-interest':              U('1552664730-d307ca884978'),
  'lesson-de-01-unconscious-bias':                  U('1522202176988-66273c2fd55f'),
  'lesson-de-02-inclusive-leadership':              U('1531482615713-2afd69097998'),
  'lesson-de-03-equity-accessibility':              U('1573497019940-1c28c88b4f3e'),
  'lesson-gd-01-gdpr-overview':                     U('1614064641938-3bbee52942c7'),
  'lesson-gd-02-data-protection-officer':           U('1573496359142-b8d87734a5a2'),
  'lesson-gd-03-international-data-transfers':      U('1526304640581-d334cdbbf45e'),
  'lesson-cs-01-safety-data-sheets':                U('1532094349884-543bc11b234d'),
  'lesson-cs-02-chemical-handling':                 U('1633265486064-086b219458ec'),
  'lesson-cs-03-hazmat-transport':                  U('1519003722824-194d4455a60c'),
  'lesson-it-01-understanding-insider-trading':     U('1611974789855-9c2a0a7236a3'),
  'lesson-it-02-trading-windows-preclearance':      U('1535320903710-d993d3d77d29'),
  'lesson-it-03-reporting-obligations':             U('1450101499163-c8848c66ca85'),
};

function getSanityClient(token: string) {
  return createClient({ projectId: PROJECT_ID, dataset: DATASET, apiVersion: API_VERSION, token, useCdn: false });
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchImage(url: string): Promise<Buffer | null> {
  try {
    const resp = await fetch(url, { signal: AbortSignal.timeout(30000) });
    if (!resp.ok) { console.log(`[HTTP ${resp.status}]`); return null; }
    return Buffer.from(await resp.arrayBuffer());
  } catch (e: any) { console.log(`[${e.message?.substring(0, 60)}]`); return null; }
}

async function main() {
  const token = process.env.SANITY_API_TOKEN;
  if (!token) { console.error('No SANITY_API_TOKEN found.'); process.exit(1); }

  const client = getSanityClient(token);
  let ok = 0, fail = 0;
  const only = new Set(process.argv.slice(2));

  const batches: [string, Record<string, string>, string][] = [
    ['Training Program Cover Images', TRAINING_PROGRAM_IMAGES, 'coverImage'],
    ['Trainer Photos', TRAINER_IMAGES, 'photo'],
    ['Lesson Poster Images', LESSON_IMAGES, 'posterImage'],
  ];

  for (const [label, mapping, field] of batches) {
    console.log(`\n=== ${label} ===`);
    for (const [docId, url] of Object.entries(mapping)) {
      if (only.size > 0 && !only.has(docId)) continue;
      process.stdout.write(`  ${docId} ... `);
      try {
        const buffer = await fetchImage(url);
        if (!buffer) { console.log('SKIP'); fail++; continue; }
        const asset = await client.assets.upload('image', buffer, { filename: `${docId}.jpg`, contentType: 'image/jpeg' });
        await client.patch(docId).set({ [field]: { _type: 'image', asset: { _type: 'reference', _ref: asset._id } } }).commit();
        console.log('OK'); ok++;
        await sleep(150);
      } catch (err: any) { console.log(`FAIL (${err.message?.substring(0, 70)})`); fail++; }
    }
  }
  console.log(`\nDone: ${ok} uploaded, ${fail} failed`);
}

main().catch((err) => { console.error('Fatal:', err); process.exit(1); });
