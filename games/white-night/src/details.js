// Small deterministic visual facts, independent of game state/save data.
export const WATCH_TIME = {hour:11, minute:53};
export function watchHands(hour = WATCH_TIME.hour, minute = WATCH_TIME.minute) {
 const hourTurn = ((hour % 12) + minute / 60) / 12;
 return [
  {turn:hourTurn,length:.244,width:.019,z:.18},
  {turn:minute/60,length:.31,width:.012,z:.19},
 ].map(h=>({...h,angle:-h.turn*Math.PI*2,x:Math.sin(h.turn*Math.PI*2)*h.length/2,y:Math.cos(h.turn*Math.PI*2)*h.length/2}));
}
