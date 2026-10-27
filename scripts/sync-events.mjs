import fs from 'node:fs';
import path from 'node:path';
import {projectFile,repoRoot,eventCode,walkEvents,checkProject} from './check-project.mjs';

const [mode,...flags]=process.argv.slice(2),dryRun=flags.includes('--dry-run');
if(!['pull','push'].includes(mode)||flags.some(f=>f!=='--dry-run')){
  console.error('Usage: node scripts/sync-events.mjs pull|push [--dry-run]');process.exit(1);
}
const normalize=text=>text.replace(/\r\n/g,'\n').trimEnd()+'\n';
const project=JSON.parse(fs.readFileSync(projectFile,'utf8'));
const mappings=[
  {file:'gameplay.js',matches:code=>code.includes('__islandGame')&&code.includes('function damage('),expected:1},
  {file:'ui.js',matches:code=>code.includes('__animalUI')&&code.includes('creditsReady'),expected:4}
];
const directory=path.join(repoRoot,'src','events');let changes=0;const pendingWrites=[];
for(const mapping of mappings){
  const events=project.layouts.flatMap(scene=>walkEvents(scene.events)).filter(event=>event.type==='BuiltinCommonInstructions::JsCode'&&mapping.matches(eventCode(event)??''));
  if(events.length!==mapping.expected)throw Error('Expected '+mapping.expected+' matching events for '+mapping.file+', found '+events.length+'. No project changes written.');
  const filename=path.join(directory,mapping.file);
  if(mode==='pull'){
    const variants=[...new Set(events.map(e=>normalize(eventCode(e))))];
    if(variants.length!==1)throw Error('The '+mapping.file+' events differ between scenes. Reconcile them in GDevelop before pulling.');
    const existing=fs.existsSync(filename)?fs.readFileSync(filename,'utf8'):null;
    if(existing!==variants[0]){changes++;pendingWrites.push([filename,variants[0]]);}
  }else{
    const code=normalize(fs.readFileSync(filename,'utf8'));new Function('runtimeScene',code);
    for(const event of events)if(normalize(eventCode(event))!==code){changes++;event.inlineCode=Array.isArray(event.inlineCode)?code.trimEnd().split('\n'):code;}
  }
}
if(mode==='pull'&&!dryRun)for(const[filename,code]of pendingWrites){fs.mkdirSync(directory,{recursive:true});fs.writeFileSync(filename,code);}
if(mode==='push'&&changes){
  const result=checkProject(project);if(result.errors.length)throw Error(result.errors.join('\n'));
  if(!dryRun){
    const backupDir=path.join(repoRoot,'.local','backups','event-sync');fs.mkdirSync(backupDir,{recursive:true});
    const backup=path.join(backupDir,'Animal Hunter-'+new Date().toISOString().replace(/[:.]/g,'-')+'.json');fs.copyFileSync(projectFile,backup,fs.constants.COPYFILE_EXCL);
    const temporary=projectFile+'.sync.tmp';fs.writeFileSync(temporary,JSON.stringify(project,null,2)+'\n',{flag:'wx'});fs.renameSync(temporary,projectFile);
    console.log('Backup: '+path.relative(repoRoot,backup));
  }
}
console.log((dryRun?'Dry run: ':'')+(changes?changes+' '+(mode==='pull'?'source file(s)':'embedded event(s)')+(dryRun?' would change.':' updated.'):'already synchronized.'));
