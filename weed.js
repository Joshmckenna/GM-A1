// *** - CLICK LOGO - *** //

var logoTag = document.querySelector("img")

logoTag.addEventListener("click", function() {

alert("Move your mouse left or right to rotate cannabis flower. Use mouse wheel to zoom in and out.")

})



// *** - VARIABLES - *** //

		// variable constant, will not be definied until the mtl and obj loaders load it
let weed = null

		// camera variables
let cameraAimX = 0
let cameraAimY = 0
let cameraAimZ = -1750

let mouseLocation = new THREE.Vector3(0, 0, -1750)

		// Add renderer to scene
const renderer = new THREE.WebGLRenderer({
  alpha : true
})


const sectionTag = document.querySelector("section")
		// add renderer to sectionTag
	sectionTag.appendChild(renderer.domElement)

		// Set up scene
const scene = new THREE.Scene()

		// New Camera
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10000)
		// move it away from the center of the object
  camera.position.z = -1750



// *** - LIGHTING - *** //
		// create ambientLight variable and add ambient light to scene
const ambientLight = new THREE.AmbientLight(0xeeeeee)
  scene.add(ambientLight)

		// add directional light (by default will be at the top)
const directionalLight = new THREE.DirectionalLight(0xcccccc, 0.75)
		// this is where the light is coming from that is casting the shadow
  directionalLight.position.set(100, 200, -200)
  directionalLight.castShadow = true

	directionalLight.shadow.mapSize.width = 3000
	directionalLight.shadow.mapSize.height = 3000
	directionalLight.shadow.camera.near = 0.1
	directionalLight.shadow.camera.far = 10000
	directionalLight.shadow.camera.top = 1000
	directionalLight.shadow.camera.bottom = -1000
	directionalLight.shadow.camera.left = -1000
	directionalLight.shadow.camera.right = 1000

  scene.add(directionalLight)


// *** - RENDERER SETUP - *** //
		// Set up size, pixel ratio and clear color
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.shadowMap.enabled = true



// *** - MATERIAL + OBJECT LOADER - *** //
// --- --- Referenced via JavaScript Promise Documentation (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) --- --- //

const loadFiles = function(mtlURL, objURL) {
  return new Promise((resolve, reject) => {
   	 // load the obj and materials
		const objLoader = new THREE.OBJLoader()
		const mtlLoader = new THREE.MTLLoader()

    mtlLoader.load(mtlURL, function(materials) {
   	 // I want to now add the materials to the objLoader
    objLoader.setMaterials(materials)
    	// I want to now load the .obj file
    objLoader.load(objURL, function(obj) {
		resolve(obj)
  	})
	})
 })
}



// *** - WEED.OBJ + WEED.MTL - *** //

		// everything as part of weed putting in group so it rotates as part of a group
let weedGroup = new THREE.Group()
	scene.add(weedGroup)

loadFiles("10460_Yellow_Poplar_Tree_v1_L3.mtl", "10460_Yellow_Poplar_Tree_v1_L3.obj").then(function(obj) {
  obj.rotateX(Math.PI * 4)
  obj.rotateY(140.1)
  obj.position.y = 150
  obj.position.x = -500
  obj.position.z = 200

 	 // change material
  const material = new THREE.MeshLambertMaterial({
    color: 0x333333
  })

 	 // how to load multiple things at once
  obj.traverse(child => {
    	// everything as part of this is casting a shadow
    child.castShadow = true
  })

  	// after object is loaded, make weed equal that obj
  weed = obj
  	// load the object onto the scene
  weedGroup.add(weed)
})




// *** - FLOOR PLATE GEOMETRY - *** //
const addFloor = function() {
  	// make a geometry, a material, a mesh and then add together.
  	// Then add to scene.
  const geometry = new THREE.CylinderGeometry(700, 850, 60, 64)
  const material = new THREE.MeshLambertMaterial({
    color: 0xaaaaaa
  })
  	// this is receiving a shadow
  const mesh = new THREE.Mesh(geometry, material)
  mesh.receiveShadow = true

		// added below under const floor --> scene.add(floor)
 		// scene.add(mesh)
  return mesh
}

const floor = addFloor()
	floor.position.y = -180
  floor.position.z = 300
  floor.position.x = -100
	scene.add(floor)



// *** - ANIMATE - *** //
const animate = function () {

  //   if (weed) {
  //   weedGroup.rotateY(0.01)
  // }

  	// Difference between where camera is now and where it should be (placed in animate)
  const cameraDiffX = cameraAimX - camera.position.x
  const cameraDiffY = cameraAimY - camera.position.y
  const cameraDiffZ = cameraAimZ - camera.position.z

 	 // now I want to move this new camera to this difference
  camera.position.x = camera.position.x + cameraDiffX * 0.05
  camera.position.y = camera.position.y + cameraDiffY * 0.05
  camera.position.z = camera.position.z + cameraDiffZ * 0.05

 	 // position the camera to look at the obj
 	camera.lookAt(scene.position)
  renderer.render(scene, camera)
  	// So that the animation is looped and run repeatedly
  requestAnimationFrame(animate)

}

animate ()


// *** - ZOOM IN / OUT - *** //
document.addEventListener("wheel", function(event){
  cameraAimZ = cameraAimZ + event.deltaY
  	// min/max zoom z-axis
  cameraAimZ = Math.max(-5000, cameraAimZ)
  cameraAimZ = Math.min(-1000, cameraAimZ)
  event.preventDefault()
})



// *** - MOVE LEFT / RIGHT - *** //
document.addEventListener("mousemove", function(event) {
  	// want camera to be focused from middle point of page
  cameraAimX = event.pageX - (window.innerWidth / 2)
  cameraAimY = event.pageY - (window.innerHeight / 2)

  	// update mouseLocation to reflect where the camera direction is in relation to the mousemove
  mouseLocation.set(cameraAimX * -1, cameraAimY * -1, -600)
})



// *** - WINDOW RESIZE - *** //
window.addEventListener("resize", function() {
	camera.aspect = window.innerWidth / window.innerHeight
  	// tells camera to refocus
  camera.updateProjectionMatrix()

  renderer.setSize(window.innerWidth, window.innerHeight)
})
