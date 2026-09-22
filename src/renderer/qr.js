(function(root,factory){
  const api=factory();
  if(typeof module!=="undefined"&&module.exports) module.exports=api;
  else root.VargaQR=api;
})(typeof globalThis!=="undefined"?globalThis:this,function(){
  "use strict";
  // QR Code Model 2, Version 4-L, byte mode. Enough for VMESH Bech32 receive addresses.
  // Fully local: no third-party QR API, CDN or network request is used.
  const SIZE=33,DATA_BYTES=80,ECC_BYTES=20;
  function gfMul(x,y){let z=0;for(let i=7;i>=0;i--){z=(z<<1)^((z>>>7)*0x11d);if((y>>>i)&1)z^=x;}return z&255;}
  function generator(deg){let g=[1],root=1;for(let i=0;i<deg;i++){const n=Array(g.length+1).fill(0);for(let j=0;j<g.length;j++){n[j]^=g[j];n[j+1]^=gfMul(g[j],root);}g=n;root=gfMul(root,2);}return g;}
  function ecc(data){const g=generator(ECC_BYTES),r=Array(ECC_BYTES).fill(0);for(const b of data){const f=b^r[0];r.shift();r.push(0);for(let i=0;i<ECC_BYTES;i++)r[i]^=gfMul(g[i+1],f);}return r;}
  function bitsFor(text){
    const bytes=Array.from(new TextEncoder().encode(text));
    if(bytes.length>78) throw new Error("QR payload too long");
    const bits=[]; const push=(v,n)=>{for(let i=n-1;i>=0;i--) bits.push((v>>>i)&1);};
    push(0b0100,4); push(bytes.length,8); for(const b of bytes) push(b,8);
    const cap=DATA_BYTES*8; for(let i=0;i<4&&bits.length<cap;i++) bits.push(0);
    while(bits.length%8) bits.push(0);
    const data=[]; for(let i=0;i<bits.length;i+=8){let b=0;for(let j=0;j<8;j++) b=(b<<1)|bits[i+j];data.push(b);}
    for(let p=0;data.length<DATA_BYTES;p++) data.push(p%2?0x11:0xec);
    return [...data,...ecc(data)];
  }
  function formatBits(mask){let d=(1<<3)|mask,rem=d<<10;const gen=0x537;for(let i=14;i>=10;i--)if((rem>>>i)&1)rem^=gen<<(i-10);return ((d<<10)|(rem&0x3ff))^0x5412;}
  function matrix(text){
    const code=bitsFor(text),m=Array.from({length:SIZE},()=>Array(SIZE).fill(false)),f=Array.from({length:SIZE},()=>Array(SIZE).fill(false));
    const set=(r,c,v)=>{if(r>=0&&c>=0&&r<SIZE&&c<SIZE){m[r][c]=!!v;f[r][c]=true;}};
    const finder=(r,c)=>{for(let y=-1;y<=7;y++)for(let x=-1;x<=7;x++){const rr=r+y,cc=c+x;if(rr<0||cc<0||rr>=SIZE||cc>=SIZE)continue;const inside=x>=0&&x<=6&&y>=0&&y<=6;const dark=inside&&(x===0||x===6||y===0||y===6||(x>=2&&x<=4&&y>=2&&y<=4));set(rr,cc,dark);}};
    finder(0,0); finder(0,SIZE-7); finder(SIZE-7,0);
    for(let i=8;i<SIZE-8;i++){set(6,i,i%2===0);set(i,6,i%2===0);}
    const align=(cr,cc)=>{for(let y=-2;y<=2;y++)for(let x=-2;x<=2;x++)set(cr+y,cc+x,Math.max(Math.abs(x),Math.abs(y))!==1);};
    align(26,26);
    const fmt=formatBits(0),bit=i=>((fmt>>>i)&1)!==0;
    for(let i=0;i<=5;i++)set(i,8,bit(i)); set(7,8,bit(6)); set(8,8,bit(7)); set(8,7,bit(8)); for(let i=9;i<15;i++)set(8,14-i,bit(i));
    for(let i=0;i<8;i++)set(8,SIZE-1-i,bit(i)); for(let i=8;i<15;i++)set(SIZE-15+i,8,bit(i)); set(SIZE-8,8,true);
    const all=[]; for(const b of code)for(let i=7;i>=0;i--)all.push((b>>>i)&1); let k=0,up=true;
    for(let c=SIZE-1;c>=1;c-=2){if(c===6)c--;for(let j=0;j<SIZE;j++){const r=up?SIZE-1-j:j;for(let d=0;d<2;d++){const cc=c-d;if(f[r][cc])continue;let v=k<all.length?all[k++]:0;if((r+cc)%2===0)v^=1;m[r][cc]=!!v;}}up=!up;}
    return m;
  }
  function draw(canvas,text,scale=6){
    const m=matrix(text),q=4,size=m.length,total=(size+q*2)*scale;
    canvas.width=total; canvas.height=total;
    const ctx=canvas.getContext("2d"); ctx.imageSmoothingEnabled=false; ctx.fillStyle="#fff"; ctx.fillRect(0,0,total,total); ctx.fillStyle="#000";
    for(let r=0;r<size;r++)for(let c=0;c<size;c++)if(m[r][c])ctx.fillRect((c+q)*scale,(r+q)*scale,scale,scale);
    return canvas;
  }
  return {matrix,draw};
});

