const fs=require('node:fs'),path=require('node:path'),net=require('node:net');
const {spawn}=require('node:child_process');
const tempRoot=require('node:os').tmpdir();
const root=path.resolve(__dirname,'..'),base=fs.mkdtempSync(path.join(tempRoot,'tasacion-form-fixture-'));
const web=base+'/web';fs.mkdirSync(web+'/lib',{recursive:true});
for(const file of ['lead-forward.php','lib/lead-delivery.php'])fs.copyFileSync(root+'/'+file,web+'/'+file);
const pause=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
 const listener=net.createServer();await new Promise(r=>listener.listen(0,'127.0.0.1',r));const port=listener.address().port;await new Promise(r=>listener.close(r));
 const server=spawn(process.env.PHP_BINARY || 'php',['-S',`127.0.0.1:${port}`,'-t',web],{windowsHide:true,stdio:'ignore',env:{...process.env,TASACION_OUTBOX_DIR:base+'/private',VENDERCRM_URL:'unconfigured',VENDERCRM_API_KEY:''}});
 try {
  const url=`http://127.0.0.1:${port}/lead-forward.php`;
  for(let i=0;i<50;i++){try{await fetch(url,{redirect:'manual'});break;}catch{await pause(100)}}
  let checks=0;
  const assert=(ok,label)=>{if(!ok)throw Error(label);checks++};
  const post=body=>fetch(url,{method:'POST',body:new URLSearchParams(body),redirect:'manual'});
  assert((await post({website:'bot',telefono:'0981000000'})).headers.get('location')==='/gracias.html','Honeypot');
  assert(!fs.existsSync(base+'/private'),'Honeypot creates no queue entry');
  assert((await post({telefono:'12'})).headers.get('location')==='/contacto/?error=telefono','Invalid phone');
  const payload={telefono:'0981000000',nombre:'Synthetic form fixture',purpose:'consulta',ciudad:'Fixture city',submission_id:'1234567890abcdef1234567890abcdef'};
  const count=()=>fs.readdirSync(base+'/private').filter(f=>f.endsWith('.json')).length;
  assert((await post(payload)).headers.get('location')==='/gracias.html?p=consulta','Durable retention permits acknowledgement');
  assert(count()===1,'One retained submission');
  await post(payload);assert(count()===1,'Double click does not duplicate');
  await post({...payload,purpose:'venta'});assert(count()===2,'Changed enquiry with same phone and request ID is distinct');
  const entries=fs.readdirSync(base+'/private').filter(f=>f.endsWith('.json')).map(f=>JSON.parse(fs.readFileSync(base+'/private/'+f)));
  assert(entries.every(x=>x.state==='pending'&&x.last_code==='configuration'),'Unavailable CRM leaves inspectable pending entries');
  assert(entries.every(x=>!JSON.stringify(x).includes('api_key')),'Queue stores no key');
  server.kill();await new Promise(r=>server.once('close',r));
  const blocked=spawn(process.env.PHP_BINARY || 'php',['-S',`127.0.0.1:${port}`,'-t',web],{windowsHide:true,stdio:'ignore',env:{...process.env,TASACION_OUTBOX_DIR:web+'/unsafe',VENDERCRM_URL:'unconfigured',VENDERCRM_API_KEY:''}});
  try{await pause(300);assert((await post(payload)).headers.get('location')==='/contacto/?error=envio','No queue and no receipt cannot show thank-you');}finally{blocked.kill();await new Promise(r=>blocked.once('close',r));}
  console.log(`PASS: ${checks} local PHP form checks; no real CRM submission.`);
 }finally{if(server.exitCode===null&&!server.killed)server.kill();}
})().catch(e=>{console.error(e.message);process.exitCode=1}).finally(()=>{
 const resolved=path.resolve(base);if(resolved.startsWith(path.resolve(tempRoot)+path.sep+'tasacion-form-fixture-'))fs.rmSync(resolved,{recursive:true,force:true});
});
