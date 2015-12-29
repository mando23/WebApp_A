
			//Preparamos el render
			var Render=new THREE.WebGLRenderer( { antialias: true } );
			
				Render.setClearColor( 0xf0f0f0 );
				Render.setPixelRatio( window.devicePixelRatio );
				Render.sortObjects = false;
				Render.shadowMapEnabled = true;
				Render.shadowMapType = THREE.PCFSoftShadowMap;
			//El escenario
			var Escenario=new THREE.Scene();
			var container;
			var stats;
			var projector, mouse = { x: 0, y: 0 };
			
			// la Figura 
			var Figura;
			var controls;
			var Ancho=window.innerWidth;
			var Alto=window.innerHeight*.60;
			var Territorio;
			var object;
			var Angulo = 45;	
			var Aspecto=Ancho/Alto;
			var cerca=0.1;
			var lejos=10000;
			var izq = false;
			var der = false;
			var ok = false;
			var ok1 = true;
			var count = 0;
			var objects = [];
			var luz, luz2;
			var last;
			//var teclado = new THREEx.KeyboardState();
			//La cámara
			var Camara=new THREE.PerspectiveCamera(Angulo,Aspecto,cerca,lejos);
			
			var loader = new THREE.JSONLoader();
			
			

			function inicio(){
					//Tamaño del render(resultado)
					Render.setSize(Ancho,Alto);
					//Se agrega el render al documento html
					container = document.getElementById('render').appendChild(Render.domElement);
					//Acercamos la cámara en z es profundidad para ver el punto
					Camara.position.z=220;
					Camara.position.y=30;
					//agregando la cámara al escenario
					Escenario.add(Camara);
					luz = new THREE.AmbientLight( 0x505050);
					luz2 = new THREE.DirectionalLight(0x505050);
					luz2.castShadow = true;
					luz2.shadowCameraVisible = true;
					luz2.shadowDarkness = 0.5;
					Escenario.add(luz);
					Escenario.add(luz2);
					// Territorio 
					//crear_plano();
					// cargar nuevos modelos
					//cargar_modelo();
					// agregamos todo el escenario y la cámara al render
					controls=new THREE.OrbitControls(Camara,Render.domElement);
						
					projector = new THREE.Projector();
					
					document.addEventListener( 'mousedown', onDocumentMouseDown, false);
			}
			
			function onDocumentMouseDown( event ){
				
				event.preventDefault();
				
				console.log("Click.");
				
				mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				mouse.y = (- ( event.clientY / window.innerHeight ) * 2 + 1)*0.5;
				
				// create a Ray with origin at the mouse position
				//   and direction into the scene (camera direction)
				var vector = new THREE.Vector3( mouse.x, mouse.y, 1 );
				projector.unprojectVector( vector, Camara );
				var ray = new THREE.Raycaster( Camara.position, vector.sub( Camara.position ).normalize() );
				// create an array containing all objects in the scene with which the ray intersects
				var intersects = ray.intersectObjects( objects );
				
				// if there is one (or more) intersections
				if ( intersects.length > 0 )
				{
					console.log("Hit @ " + toString( intersects[0].point ) );
					// change the color of the closest face.
					intersects[ 0 ].face.color.setRGB( 0.8 * Math.random() + 0.2, 0, 0 ); 
					intersects[ 0 ].object.geometry.colorsNeedUpdate = true;
				}
			}
			
			function toString(v) { return "[ " + v.x + ", " + v.y + ", " + v.z + " ]"; }
			
			
			function cargar_modelo(){
					
					// Geometría
					Geometria=new THREE.Geometry();
					var vertices=[	[-5,10,0],
									[0,5,0],
									[5,10,0],
									[5,20,0],
									[0,15,0],
									[-5,20,0],
									[-5,10,0],
									[-5,10,2],
									[0,5,2],
									[5,10,2],
									[5,20,2],
									[0,15,2],
									[-5,20,2],
									[-5,10,2]];
					
					var long_vertices=vertices.length;
					for(i=0;i<long_vertices;i++){
							x=vertices[i][0];
							y=vertices[i][1];
							z=vertices[i][2];
							//Agregamos vértices al vector
							Vector=new THREE.Vector3(x,y,z);
							//Agregamos el vector a la geometría
							Geometria.vertices.push(Vector);   
					}
					// agregamos un material para que el punto tenga color
					Material=new THREE.ParticleBasicMaterial({color:0XFF0000});
					// creamos una partícula con la geometría y el material
					Figura=new THREE.Line(Geometria,Material);

					// agregamos la partícula al escenario
					Escenario.add(Figura);
					objects.push(Figura);
					count++;
					//modelo_js();
					//crear_plano();
			}
			$('#show_figure1').click(function(){cargar_modelo();});
			function crear_plano(){
					//Geometría del plano
					Geometria_plano=new THREE.CylinderGeometry(100,100,10,100);
					//Textura
					Textura_plano=new THREE.ImageUtils.loadTexture("cesped.jpg");
					Textura_plano.wrapS=Textura_plano.wrapT=THREE.RepeatWrapping;
					Textura_plano.repeat.set(10,10);
					// Material y agregado la textura
					Material_plano=new THREE.MeshBasicMaterial({map:Textura_plano,side:THREE.DoubleSide});
					// El plano (Territorio)
					Territorio=new THREE.Mesh(Geometria_plano,Material_plano);
					Territorio.rotation.y=-0.5
					Territorio.castShadow = true;
					Territorio.receiveShadow = true;
					//Territorio.rotation.x=Math.PI/2;
					Escenario.add(Territorio);
					objects.push(Territorio);
					count++;
			}
			$('#show_figure2').click(function(){crear_plano();});
			function animacion(){
					requestAnimationFrame(animacion);
					if( izq ){
						if(!ok1)
						object.position.x-=16;
						izq = false;
					}
					if( der ){
						if(!ok1)
						object.position.x+=16;
						der = false;
					}
					
					if ( ok ){
						if ( !ok1){
						object.position.y-=10;
						ok = false;
						ok1 = true;
					}}
					
					render_modelo();
					
					
			}
			function render_modelo(){
					controls.update();
					Render.render(Escenario,Camara);
			}
			
			function modelo_js(){
				if( ok1 ){
				ok1 = false;
				loader.load('chasis.json',
				function (geometry){
					
					Material_modelo=new THREE.MeshLambertMaterial({color:0X24c51b});
					object = new THREE.Mesh(geometry, Material_modelo);
						
						object.position.x =-48;
                        object.position.y =10;
                        object.position.z =28.5;
					
						object.castShadow = false;
						object.receiveShadow = false;
						Escenario.add(object);
						objects.push(object);
						count++;
					
					object.scale.x=1;
					object.scale.y=1;
					object.scale.z=1;
					
				
					;
				});
				
			}}
			$('#show_clone').click(function(){modelo_js();});
			
			
			function rem_1(){
			Escenario.remove(Figura);
			}
			$('#rem_1').click(function(){rem_1();});
			
			function rem_2(){
			Escenario.remove(Territorio);
			}
			$('#rem_2').click(function(){rem_2();});
			
			function rem_3(){
			if (count != 0)
			count--;
/* 			if (object==last){
			Escenario.remove(last);
			objects.pop();
			}
			else{ */
			var first = objects[count];	
			Escenario.remove(first);
			objects.pop();
/* 			if (count >= 0)
			count--; */
			}//}
			$('#rem_3').click(function(){rem_3();});
			
			/**************************llamado a las funciones ******************/
			

			inicio();
			animacion();
			//modelo_js();
			//crear_plano();
			
			
			
			
			
			
			
			
			
			
			
			
			
/* 			

			//Preparamos el render
			var Render=new THREE.WebGLRenderer( { antialias: true } );
			Render.setClearColor( 0xf0f0f0 );
			Render.setPixelRatio( window.devicePixelRatio );
			Render.sortObjects = false;
			//El escenario
			var Escenario=new THREE.Scene();
			var container;
			var stats;
			var camera, controls2;
			
			// la Figura 
			var Figura;
			var controls;
			var Ancho=window.innerWidth*0.6;
			var Alto=window.innerHeight*0.6;
			var Territorio;
			var object;
			var Angulo = 30;	
			var Aspecto=Ancho/Alto;
			var cerca=0.01;
			var lejos=10000;
			var izq = false;
			var der = false;
			var ok = false;
			var objects = [];
			var plane;
			//var teclado = new THREEx.KeyboardState();
			//La cámara
			var Camara=new THREE.PerspectiveCamera(Angulo,Aspecto,cerca,lejos);
			
			var loader = new THREE.JSONLoader();
			
			var raycaster = new THREE.Raycaster();
			var mouse = new THREE.Vector2(),
			offset = new THREE.Vector3(),
			INTERSECTED, SELECTED;
			

			function inicio(){
					//Tamaño del render(resultado)
					Render.setSize(Ancho,Alto);
					//Se agrega el render al documento html
					container = document.getElementById('render').appendChild(Render.domElement);
					//Acercamos la cámara en z es profundidad para ver el punto
					Camara.position.z=220;
					Camara.position.y=30;
					//agregando la cámara al escenario
					Escenario.add(Camara);
					
					
					
					// Territorio 
					//crear_plano();
					// cargar nuevos modelos
					//cargar_modelo();
					// agregamos todo el escenario y la cámara al render
					controls=new THREE.OrbitControls(Camara,Render.domElement);
					
					camera = new THREE.PerspectiveCamera( 70, Aspecto, 1, 10000 );
					camera.position.z = 1000;

					controls2 = new THREE.TrackballControls( camera );
					controls2.rotateSpeed = 1.0;
					controls2.zoomSpeed = 1.2;
					controls2.panSpeed = 0.8;
					controls2.noZoom = false;
					controls2.noPan = false;
					controls2.staticMoving = true;
					controls2.dynamicDampingFactor = 0.3;
					
					plane = new THREE.Mesh(
					new THREE.PlaneBufferGeometry( 2000, 2000, 8, 8 ),
					new THREE.MeshBasicMaterial( { visible: false } )
					);
					Escenario.add( plane );
					
					Render.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
					Render.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
					Render.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );

				

					//window.addEventListener( 'resize', onWindowResize, false );
			}
			

			
			function onDocumentMouseMove( event ) {

				event.preventDefault();

				mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
				mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

				//

				raycaster.setFromCamera( mouse, Camara );

				if ( SELECTED ) {

					var intersects = raycaster.intersectObject( plane );

					if ( intersects.length > 0 ) {

						SELECTED.position.copy( intersects[ 0 ].point.sub( offset ) );

					}

					return;

				}

				var intersects = raycaster.intersectObjects( objects );

				if ( intersects.length > 0 ) {

					if ( INTERSECTED != intersects[ 0 ].object ) {

						if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

						INTERSECTED = intersects[ 0 ].object;
						INTERSECTED.currentHex = INTERSECTED.material.color.getHex();

						plane.position.copy( INTERSECTED.position );
						plane.lookAt( Camara.position );

					}

					container.style.cursor = 'pointer';

				} else {

					if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

					INTERSECTED = null;

					container.style.cursor = 'auto';

				}

			}
			
			function onDocumentMouseDown( event ) {

				event.preventDefault();

				raycaster.setFromCamera( mouse, Camara );

				var intersects = raycaster.intersectObjects( objects );

				if ( intersects.length > 0 ) {

					controls.enabled = false;

					SELECTED = intersects[ 0 ].object;

					var intersects = raycaster.intersectObject( plane );

					if ( intersects.length > 0 ) {

						offset.copy( intersects[ 0 ].point ).sub( plane.position );

					}

					container.style.cursor = 'move';

				}

			}
			
			function onDocumentMouseUp( event ) {

				event.preventDefault();

				controls.enabled = true;

				if ( INTERSECTED ) {

					plane.position.copy( INTERSECTED.position );

					SELECTED = null;

				}

				container.style.cursor = 'auto';

			}
			
			function cargar_modelo(){
					
					// Geometría
					Geometria=new THREE.Geometry();
					var vertices=[	[-5,10,0],
									[0,5,0],
									[5,10,0],
									[5,20,0],
									[0,15,0],
									[-5,20,0],
									[-5,10,0],
									[-5,10,2],
									[0,5,2],
									[5,10,2],
									[5,20,2],
									[0,15,2],
									[-5,20,2],
									[-5,10,2]];
					
					var long_vertices=vertices.length;
					for(i=0;i<long_vertices;i++){
							x=vertices[i][0];
							y=vertices[i][1];
							z=vertices[i][2];
							//Agregamos vértices al vector
							Vector=new THREE.Vector3(x,y,z);
							//Agregamos el vector a la geometría
							Geometria.vertices.push(Vector);   
					}
					// agregamos un material para que el punto tenga color
					Material=new THREE.ParticleBasicMaterial({color:0XFF0000});
					// creamos una partícula con la geometría y el material
					Figura=new THREE.Line(Geometria,Material);
					// agregamos la partícula al escenario
					Escenario.add(Figura);
					objects.push(Figura);
					//modelo_js();
					//crear_plano();
			}
			$('#show_figure1').click(function(){cargar_modelo();});
			function crear_plano(){
					//Geometría del plano
					Geometria_plano=new THREE.CylinderGeometry(100,100,10,100);
					//Textura
					Textura_plano=new THREE.ImageUtils.loadTexture("cesped.jpg");
					Textura_plano.wrapS=Textura_plano.wrapT=THREE.RepeatWrapping;
					Textura_plano.repeat.set(10,10);
					// Material y agregado la textura
					Material_plano=new THREE.MeshBasicMaterial({map:Textura_plano,side:THREE.DoubleSide});
					// El plano (Territorio)
					Territorio=new THREE.Mesh(Geometria_plano,Material_plano);
					Territorio.rotation.y=-0.5
					//Territorio.rotation.x=Math.PI/2;
					Escenario.add(Territorio);
					objects.push(Territorio);
			}
			$('#show_figure2').click(function(){crear_plano();});
			function animacion(){
					requestAnimationFrame(animacion);
					if( izq ){
						object.position.x-=8.35;
						izq = false;
					}
					if( der ){
						object.position.x+=8.35;
						der = false;
					}
					
					render_modelo();

			}
			function render_modelo(){
					controls.update();
					Render.render(Escenario,Camara);
			}
			
			function modelo_js(){
				
				loader.load('brick_quads.json',
				function (geometry){
					//var material_clone = new THREE.MeshFaceMaterial(materials);
					// Material y agregado la textura
					Material_modelo=new THREE.MeshBasicMaterial({color:0XFF0000});
					object = new THREE.Mesh(geometry, Material_modelo);
						
						object.position.x =0;
                        object.position.y =10;
                        object.position.z =0;
					
					Escenario.add(object);
					object.scale.x=4;
					object.scale.y=4;
					object.scale.z=4;
					;
				});
				objects.push(object);
			}
			$('#show_clone').click(function(){modelo_js();});
			
			
			function animacion_izq(){
					requestAnimationFrame(animacion);
					render_modelo();
					
						object.position.x-=10;
			}
			$('#izq').click(function(){animacion_izq();});

			

			inicio();
			animacion();
			//modelo_js();
			//crear_plano();

 */