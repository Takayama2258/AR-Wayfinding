function GetURLParameter(sParam){
  var sPageURL = window.location.search.substring(1);
  var sURLVariables = sPageURL.split('&');
  for (var i = 0; i < sURLVariables.length; i++) 
  {
      var sParameterName = sURLVariables[i].split('=');
      if (sParameterName[0] == sParam) 
      {
          return sParameterName[1];
      }
  }
}

var angle = GetURLParameter('angle');
if (!angle){angle = 0}

// sample url: https://localhost:3000/?angle=1.51
// angle 是弧度制
// angle = 0 朝前
// angle = 1.51 朝右


AFRAME.registerComponent("listener", {
    init: function() {
      this.target = document.querySelector('#target');
      this.prevPosition = null;
      this.prevRotation = null;
      this.initRotation = new THREE.Vector3( -1.51, parseFloat(angle), 0.2 );
    },
   tick: function() {
     if (this.el.object3D.visible) {
       this.target.setAttribute('visible', 'true')
       if(this.prevPosition) {
         this.target.object3D.position.lerp(this.prevPosition, 0.1)
         let rot = this.target.object3D.rotation.toVector3().lerp(this.prevRotation, 0.1)
         this.target.object3D.rotation.setFromVector3(rot)

        // slerp
        // let angle = Math.acos(this.prevRotation*this.target.object3D.rotation)
        // this.target.object3D.rotation.set(this.target.object3D.rotation * Math.sin(0.9*angle)/Math.sin(angle) + this.prevRotation * Math.sin(0.1*angle)/Math.sin(angle))

       } else {
         this.target.setAttribute('position', this.el.getAttribute('position'))
        //  this.target.setAttribute('rotation', this.el.getAttribute('rotation'))
        this.target.object3D.rotation.setFromVector3(this.el.object3D.rotation.toVector3().add(this.initRotation))
       }
       this.prevPosition = this.el.object3D.position
       this.prevRotation = (this.el.object3D.rotation.toVector3().add(this.initRotation))
      //  this.prevRotation = this.target.object3D.rotation

      } else {
       this.target.setAttribute('visible', 'false')
        this.prevPosition = null;
        this.prevRotation = null;
      }
   }
 });