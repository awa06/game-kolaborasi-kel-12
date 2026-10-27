// Icon-only buttons shared by the opening, gameplay pause menu and result screens.
const sceneName=runtimeScene.getName();
const objects=name=>runtimeScene.getObjects(name);
const first=name=>objects(name)[0];
const input=runtimeScene.getGame().getInputManager();
const globals=runtimeScene.getGame().getVariables();
let ui=runtimeScene.__animalUI;
if(!ui||runtimeScene.getTimeManager().isFirstFrame()||ui.sceneName!==sceneName){
  ui=runtimeScene.__animalUI={sceneName,modal:'',keys:{},mouseDown:false,pressed:'',transitioning:false};
  for(const code of [13,27,72,80,82])ui.keys[code]=input.isKeyPressed(code);
  runtimeScene.getTimeManager().setTimeScale(1);
  const hero=first('MenuHero');
  if(hero){hero.activateBehavior('Platformer',false);hero.setAnimationName(sceneName==='game over'?'Death':'Idle');}
  if(first('MenuBackground'))first('MenuBackground').setColor(sceneName==='game over'?'125;155;205':sceneName==='winner'?'255;230;175':'255;255;255');
}
const game=runtimeScene.__islandGame;
const isGame=sceneName==='permainan';
const isResult=sceneName==='winner'||sceneName==='game over';
const keyEdge=code=>{const now=input.isKeyPressed(code),edge=now&&!ui.keys[code];ui.keys[code]=now;return edge;};
const enter=keyEdge(13),escape=keyEdge(27),helpKey=keyEdge(72),pauseKey=keyEdge(80),replayKey=keyEdge(82);
function navigate(name){runtimeScene.getTimeManager().setTimeScale(1);ui.modal='';ui.transitioning=true;gdjs.evtTools.runtimeScene.replaceScene(runtimeScene,name,false);}
function modal(name){ui.modal=ui.modal===name?'':name;runtimeScene.getTimeManager().setTimeScale(ui.modal?0:1);}
function showCredits(returnTo=''){ui.modal='credits';ui.creditsReturnTo=returnTo;runtimeScene.getTimeManager().setTimeScale(0);}
function closeDialog(){
  if(ui.modal==='treasure'){showCredits();return;}
  if(ui.modal==='credits'&&ui.creditsReturnTo){const back=ui.creditsReturnTo;ui.creditsReturnTo='';ui.modal=back;runtimeScene.getTimeManager().setTimeScale(0);return;}
  modal(ui.modal);
}
function text(name,value){const o=first(name);if(o&&o.getString()!==String(value))o.setString(String(value));}
function visible(name,show){for(const o of objects(name))o.hide(!show);}
function panel(name,fill,opacity,x1,y1,x2,y2,outline=0){const o=first(name);if(!o)return;o.setFillColor(fill);o.setFillOpacity(opacity);o.setOutlineColor('194;148;62');o.setOutlineSize(outline);o.setOutlineOpacity(outline?255:0);o.drawRectangle(x1,y1,x2,y2);}
if(escape){if(ui.modal)closeDialog();else if(isGame)modal('pause');else if(isResult)navigate('opening');}
if(isGame&&pauseKey&&(!ui.modal||ui.modal==='pause'))modal('pause');
if(helpKey&&(!ui.modal||ui.modal==='help'))modal('help');
if(replayKey&&(isGame||isResult))navigate('permainan');
if(enter){if(ui.modal)closeDialog();else if(sceneName==='opening')navigate('permainan');}
if(ui.transitioning)return;
// Treasure uses wall-clock time because gameplay time is deliberately paused.
if(ui.modal==='treasure'&&Date.now()-ui.treasureShownAt>=2100)showCredits();

const creditsReady=globals.get('AHCreditsReady').getAsBoolean();
const normalButtons=isGame?['HUDPause','HUDReplay','HUDHelp']:sceneName==='opening'?['BtnPlay','BtnHelp','BtnExit',...(creditsReady?['BtnCredits']:[])]:['BtnReplay','BtnHome',...(creditsReady?['BtnCredits']:[])];
for(const name of ['HUDPause','HUDReplay','HUDHelp','BtnPlay','BtnHelp','BtnExit','BtnCredits','BtnReplay','BtnHome'])visible(name,!ui.modal&&normalButtons.includes(name));
visible('ModalContinue',!!ui.modal);visible('ModalReplay',ui.modal==='pause');visible('ModalHome',ui.modal==='pause');visible('ModalCredits',ui.modal==='pause'&&creditsReady);visible('ModalBadge',!!ui.modal&&ui.modal!=='treasure');visible('HelpText',ui.modal==='help');visible('CreditsText',false);
const cont=first('ModalContinue');if(cont){const size=ui.modal==='pause'?80:96;cont.setWidth(size);cont.setHeight(size);cont.setPosition(ui.modal==='pause'?408:592,ui.modal==='pause'?390:ui.modal==='credits'||ui.modal==='treasure'?588:520);}
for(const [name,x]of [['ModalReplay',536],['ModalCredits',664],['ModalHome',792]]){const o=first(name);if(o){o.setPosition(x,390);o.setWidth(80);o.setHeight(80);}}
const badge=first('ModalBadge');if(badge){const size=ui.modal==='credits'?48:64;badge.setAnimationName(ui.modal==='help'?'Help':ui.modal==='credits'?'Credits':'Pause');badge.setWidth(size);badge.setHeight(size);badge.setPosition(ui.modal==='credits'?616:608,ui.modal==='pause'?250:ui.modal==='credits'?100:188);}
for(const name of ['CreditsHeading','PortraitProgrammer','PortraitArtist','PortraitLevelDesign','CreditNameProgrammer','CreditRoleProgrammer','CreditNimProgrammer','CreditNameArtist','CreditRoleArtist','CreditNimArtist','CreditNameLevelDesign','CreditRoleLevelDesign','CreditNimLevelDesign'])visible(name,ui.modal==='credits');
for(const name of ['TreasureChest','TreasureGlow','TreasureHeading','TreasureStory'])visible(name,ui.modal==='treasure');
if(ui.modal==='treasure'){
 const elapsed=Date.now()-ui.treasureShownAt;
 const chest=first('TreasureChest');if(chest){chest.setAnimationName(elapsed<350?'Closed':'Open');chest.setWidth(288);chest.setHeight(288);}
 const glow=first('TreasureGlow');if(glow)glow.setOpacity(elapsed<350?0:85+Math.sin(elapsed/120)*35);
}
text('HelpText','MOVE     Arrow keys / A D\nJUMP     Space / W\nSHOOT    J / X\nPAUSE    P / Esc\n\nFind the brass key, then reach the exit.');
const shade=first('ModalShade');if(shade)shade.clear();
if(ui.modal){
  panel('ModalShade','5;15;27',185,0,0,1280,720);
  if(ui.modal==='pause')panel('ModalShade','13;41;43',248,380,220,900,530,4);
  else if(ui.modal==='credits'){
    panel('ModalShade','13;41;43',252,100,70,1180,700,4);
    for(const x of [150,490,830]){
      panel('ModalShade','20;55;53',255,x,230,x+300,555,2);
      panel('ModalShade','255;255;255',255,x+14,244,x+286,444,1);
    }
  }
  else if(ui.modal==='treasure')panel('ModalShade','13;41;43',252,300,90,980,700,4);
  else panel('ModalShade','13;41;43',248,320,160,960,640,4);
}
const hud=first('HUDPlate');if(hud){hud.clear();panel('HUDPlate','7;30;39',155,12,10,780,76,1);}
const backdrop=first('ScreenShade');if(backdrop){backdrop.clear();if(isResult)panel('ScreenShade','8;19;34',sceneName==='winner'?65:150,0,0,1280,720);}
if(isGame&&game){
 text('HUDLivesValue',game.lives);text('HUDAmmoValue',game.ammo);text('HUDCoinsValue',game.coins+'/'+game.totalCoins);text('HUDScoreValue',game.score);
 if(first('HUDKeyIcon'))first('HUDKeyIcon').setOpacity(game.key?255:65);
}
if(isResult){
 text('ResultTitle',sceneName==='winner'?'ISLAND CLEARED':'GAME OVER');
 text('ResultScore',globals.get('AHLastScore').getAsNumber());
 text('ResultCoins',globals.get('AHLastCoins').getAsNumber()+'/'+globals.get('AHLastTotalCoins').getAsNumber());
}

// Hit-test only the currently visible icon controls. Modal buttons capture input.
const mx=gdjs.evtTools.input.getMouseX(runtimeScene,'HUD',0),my=gdjs.evtTools.input.getMouseY(runtimeScene,'HUD',0);
const active=ui.modal?(ui.modal==='pause'?['ModalContinue','ModalReplay','ModalCredits','ModalHome']:['ModalContinue']):normalButtons;
const down=input.isMouseButtonPressed(0),released=input.isMouseButtonReleased(0);
let hover='';
for(const name of active){const o=first(name);if(!o)continue;const inside=mx>=o.getX()&&mx<=o.getX()+o.getWidth()&&my>=o.getY()&&my<=o.getY()+o.getHeight();if(inside)hover=name;o.setColor(inside?'255;229;170':'255;255;255');o.setOpacity(down&&inside?180:255);}
if(down&&!ui.mouseDown)ui.pressed=hover;
const clicked=released&&hover&&ui.pressed===hover?hover:'';
if(!down)ui.pressed='';ui.mouseDown=down;
if(clicked==='HUDPause')modal('pause');
if(clicked==='HUDHelp'||clicked==='BtnHelp')modal('help');
if(clicked==='ModalContinue')closeDialog();
if(clicked==='BtnCredits')showCredits();
if(clicked==='ModalCredits')showCredits('pause');
if(['HUDReplay','ModalReplay','BtnReplay','BtnPlay'].includes(clicked))navigate('permainan');
if(['ModalHome','BtnHome'].includes(clicked))navigate('opening');
if(clicked==='BtnExit'){ui.transitioning=true;gdjs.evtTools.runtimeScene.stopGame(runtimeScene);}
