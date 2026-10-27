import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const repoRoot=fileURLToPath(new URL('../',import.meta.url));
export const projectFile=path.join(repoRoot,'Animal Hunter.json');
export const eventCode=event=>Array.isArray(event.inlineCode)?event.inlineCode.join('\n'):event.inlineCode;
export function walkEvents(events){return(events??[]).flatMap(event=>[event,...walkEvents(event.events)]);}

export function checkProject(project,filename=projectFile){
  const errors=[];
  const unique=(values,label)=>{if(new Set(values).size!==values.length)errors.push('Duplicate '+label);};
  if(!Array.isArray(project.layouts)||!project.layouts.length)return{errors:['Project has no scenes']};
  const globals=project.objects??[],resources=project.resources?.resources??[];
  unique(project.layouts.map(s=>s.name),'scene names');unique(globals.map(o=>o.name),'global object names');unique(resources.map(r=>r.name),'resource names');
  if(project.firstLayout&&!project.layouts.some(s=>s.name===project.firstLayout))errors.push('First scene does not exist: '+project.firstLayout);
  let jsEvents=0;
  for(const scene of project.layouts){
    unique(scene.objects.map(o=>o.name),'object names in '+scene.name);
    const objects=new Set([...globals,...scene.objects].map(o=>o.name));
    for(const instance of scene.instances??[])if(!objects.has(instance.name))errors.push(scene.name+': instance refers to missing object '+instance.name);
    for(const event of walkEvents(scene.events))if(event.type==='BuiltinCommonInstructions::JsCode'){
      jsEvents++;try{new Function('runtimeScene',eventCode(event));}catch(error){errors.push(scene.name+': JavaScript syntax error: '+error.message);}
    }
  }
  let localResources=0;
  const root=path.resolve(repoRoot),pngSignature='89504e470d0a1a0a';
  for(const resource of resources){
    if(!resource.file||/^(https?:|data:)/i.test(resource.file))continue;
    localResources++;
    if(path.isAbsolute(resource.file)){errors.push('Resource has an absolute path: '+resource.name);continue;}
    const file=path.resolve(path.dirname(filename),resource.file),relative=path.relative(root,file);
    if(relative.startsWith('..'+path.sep)||relative==='..'||path.isAbsolute(relative)){errors.push('Resource is outside the repository: '+resource.name);continue;}
    if(!fs.existsSync(file)){errors.push('Missing resource: '+resource.name+' -> '+resource.file);continue;}
    if(/\.png$/i.test(file)&&fs.readFileSync(file).subarray(0,8).toString('hex')!==pngSignature)errors.push('Invalid PNG: '+resource.file);
  }
  const names=new Set(resources.map(r=>r.name));
  const imageKeys=new Set(['image','texture','atlasImage','backgroundImageResourceName']);
  function references(value,key=''){
    if(typeof value==='string'&&imageKeys.has(key)&&value&&!names.has(value))errors.push('Unregistered image reference: '+value);
    else if(Array.isArray(value))value.forEach(v=>references(v));
    else if(value&&typeof value==='object')for(const[k,v]of Object.entries(value))if(k!=='resources')references(v,k);
  }
  references(project);
  return{errors,scenes:project.layouts.length,localResources,jsEvents};
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
  try{
    const result=checkProject(JSON.parse(fs.readFileSync(projectFile,'utf8')));
    if(result.errors.length){console.error(result.errors.join('\n'));process.exitCode=1;}
    else console.log('Project OK: '+result.scenes+' scenes, '+result.localResources+' local resources, '+result.jsEvents+' JavaScript events.');
  }catch(error){console.error(error.message);process.exitCode=1;}
}
