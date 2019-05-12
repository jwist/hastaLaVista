'use strict';define(['modules/default/defaultcontroller'],function(a){'use strict';function b(){}return $.extend(!0,b.prototype,a),b.prototype.getToolbar=function(){var c=a.getToolbar.call(this);return c.unshift({onClick:function(){window.open('http://wiki.jmol.org/index.php/Mouse_Manual','_blank')},title:'Help',cssClass:'fa fa-question',ifLocked:!0}),c},b.prototype.moduleInformation={name:'JSMol',description:'Display a JSMol module',author:'Nathana\xEAl Khodl, Luc Patiny',date:'30.12.2013',license:'MIT',cssClass:'jsmol'},b.prototype.references={data:{type:['cif','pdb','mol3d','magres','mol2d','jme','string'],label:'A molecule/protein data'},message:{type:['string'],label:'Messages from jsmol'},atom:{type:['string'],label:'A string describing the clicked atom'},execResult:{type:['string'],label:'Result of executing sync script'}},b.prototype.events={onMessage:{label:'A new message from jsmol arrived',refVariable:['message']},onAtomClick:{label:'An atom was clicked',refVariable:['atom']},onAtomHover:{label:'An atom was hovered',refVariable:['atom']},onExecResult:{label:'New sync exec result',refVariable:['execResult']}},b.prototype.variablesIn=['data'],b.prototype.configurationStructure=function(){return{groups:{group:{options:{type:'list'},fields:{prefs:{type:'checkbox',title:'Options',default:[],options:{webgl:'Enable webgl (fast but limited rendering options)'}},script:{type:'jscode',title:'After load script'},syncScript:{type:'jscode',title:'Sync after load script'}}}}}},b.prototype.configAliases={script:['groups','group',0,'script',0],syncScript:['groups','group',0,'syncScript',0],prefs:['groups','group',0,'prefs',0]},b.prototype.actionsIn={jsmolscript:'Some JSMol Script received',jsmolscriptSync:'Sync jsmol Script to execute'},b.prototype.onRemove=function(){this.module.view.remove(this.module.getId())},b.prototype.onNewMessage=function(c){this.createDataFromEvent('onMessage','message',c)},b.prototype.onAtomClick=function(c){this.createDataFromEvent('onAtomClick','atom',c)},b.prototype.onAtomHover=function(c){this.createDataFromEvent('onAtomHover','atom',c)},b.prototype.onSyncExecDone=function(c){this.createDataFromEvent('onExecResult','execResult',c)},b.prototype.export=function(){return this.module.view.postMessage('executeScriptSync',['write PNGJ jsmol.png'])},b});