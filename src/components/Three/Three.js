import React, { Component } from "react";
import * as THREE from "three";
class Three extends Component {
  componentDidMount() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    this.mount.appendChild(renderer.domElement);

    // DEFINE OBJECTS / PARAMETERS
    let wireframes = [];
    let numCubes = 100;
    let startPos = { x: 0, y: 0, z: -200 };
    let spread = { x: 0, y: 0, z: 4 };
    let movement = { x: 0, y: 0, z: 0.12 };
    let rotation = { x: -0.005, y: 0, z: 0.0 };
    for (var i = 0; i < numCubes; i++) {
      var geometry = new THREE.CubeGeometry(15, 10, 10);
      var geo = new THREE.EdgesGeometry(geometry);
      var mat = new THREE.LineBasicMaterial({
        color: 0xff7ff8,
        linewidth: 2,
      });
      var wireframe = new THREE.LineSegments(geo, mat);

      wireframe.position.x = startPos.x + spread.x * i;
      wireframe.position.y = startPos.y + spread.y * i;
      wireframe.position.z = startPos.z + spread.z * i;

      scene.add(wireframe);
      wireframes.push(wireframe);
    }

    // --------

    // UTIL/TRANSFORM STUFF
    var frustum = new THREE.Frustum();
    frustum.setFromProjectionMatrix(
      new THREE.Matrix4().multiplyMatrices(
        camera.projectionMatrix,
        camera.matrixWorldInverse
      )
    );

    const onMouseMove = (x, y) => {
      wireframes.forEach((wf) => {
        wf.position.y = easeFunction(y, height / 2, 0.5, 1.3);
        wf.position.x = easeFunction(x, width / 2, 0.5, 1.3);
      });
    };

    // pow changes the shape of the curve - higher pow = higher accelleration towards 0 and 1
    // rangeMultiplier is applied at the end, so it just returns something between 0 and 1 * range multiplier
    // rangeMax is used to convert x into a float between -1 and 1
    const easeFunction = (x, rangeMax, rangeMultiplier = 1, pow = 2) => {
      let floatX = Math.abs(x / rangeMax);
      let squared = Math.pow(floatX, pow);
      let result = squared / (squared + Math.pow(1 - floatX, pow));
      return x > 0 ? rangeMultiplier * result : -(rangeMultiplier * result);
    };
    const logKey = (e) => {
      let centerX = width / 2;
      let centerY = height / 2;
      let centerDistX = e.clientX - centerX;
      let centerDistY = centerY - e.clientY;
      onMouseMove(centerDistX, centerDistY);
    };
    const onPhoneMotion = (event) => {
      // const { alpha, beta, gamma } = event;
      // console.log(alpha, beta, gamma);
      // console.log(event);
      // let x = alpha + gamma;
      // let y = beta;
      const { accelerationIncludingGravity } = event;
      let x = accelerationIncludingGravity.x;
      let y = accelerationIncludingGravity.y + accelerationIncludingGravity.z;
      wireframes.forEach((wf) => {
        wf.position.y = easeFunction(x % 720, 720, 1, 1.3);
        wf.position.x = easeFunction(y % 360, 360, 1, 1.3);
      });
    };
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      // show the enable motion button
      // window.addEventListener("deviceorientation", onPhoneMotion);
    } else {
      window.addEventListener("mousemove", logKey);
    }

    const requestMotionPermission = () => {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        console.log("requestMotionPermission called - requesting permission");
        // this is true if there is device motion stuff
        //const isMotionPossible = window.DeviceMotionEvent && typeof window.DeviceMotionEvent.requestPermission === "function";

        // if (isMotionPossible) {
        DeviceMotionEvent.requestPermission().then((response) => {
          console.log("adding listener - response:", response);
          // do stuff here when permission is accepted
          // listener on the motion event :)
          window.addEventListener("devicemotion", onPhoneMotion, true);
        });
        // }
      } else {
        console.log("not a phone, not reuqesting permission");
      }
    };

    document.getElementById("gif").onclick = requestMotionPermission;

    // ---------

    camera.position.z = 0;

    var animate = () => {
      requestAnimationFrame(animate);

      // DO STUFF
      wireframes.forEach((wf) => {
        wf.position.x += movement.x;
        wf.position.y += movement.y;
        wf.position.z += movement.z;
        wf.rotation.x += rotation.x;
        wf.rotation.y += rotation.y;
        wf.rotation.z += rotation.z;
        if (!frustum.containsPoint(wf.position)) {
          // If they've moved out of the field of view, put them back to startpos
          wf.position.x = startPos.x;
          wf.position.y = startPos.y;
          wf.position.z = startPos.z;
        }
      });
      //-------

      this.props.onAnimate(wireframes[0]);

      renderer.render(scene, camera);
    };

    // keep the canvas responsive
    window.addEventListener("resize", () => {
      width = window.innerWidth;
      height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    });

    animate();
  }
  render() {
    return (
      <div>
        <div className="fatCanvas" ref={(ref) => (this.mount = ref)} />
      </div>
    );
  }
}
export default Three;
