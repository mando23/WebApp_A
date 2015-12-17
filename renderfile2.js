/******************************* variables *******************/
			//Preparamos el render
			var Render=new THREE.WebGLRenderer();
			//El escenario
			var Escenario=new THREE.Scene();
			
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
			var teclado = new THREEx.KeyboardState();
			//La cámara
			var Camara=new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
			Camara.position.z = 1000;
			
			var loader = new THREE.JSONLoader();
			
			
			/******************************* inicio *******************/
			function inicio(){
					//Tamaño del render(resultado)
					Render.setSize(Ancho,Alto);
					//Se agrega el render al documento html
					document.getElementById('render').appendChild(Render.domElement);
					//Acercamos la cámara en z es profundidad para ver el punto
					//Camara.position.z=220;
					//Camara.position.y=30;
					//agregando la cámara al escenario
					//Escenario.add(Camara);
					// Territorio 
					//crear_plano();
					// cargar nuevos modelos
					//cargar_modelo();
					// agregamos todo el escenario y la cámara al render
					controls = new THREE.TrackballControls( Camara );
					controls.rotateSpeed = 1.0;
					controls.zoomSpeed = 1.2;
					controls.panSpeed = 0.8;
					controls.noZoom = false;
					controls.noPan = false;
					controls.staticMoving = true;
					controls.dynamicDampingFactor = 0.3;
					
					Escenario.add( new THREE.AmbientLight( 0x505050 ) );

					var light = new THREE.SpotLight( 0xffffff, 1.5 );
					light.position.set( 0, 500, 2000 );
					light.castShadow = true;

					light.shadowCameraNear = 200;
					light.shadowCameraFar = Camara.far;
					light.shadowCameraFov = 50;

					light.shadowBias = -0.00022;

					light.shadowMapWidth = 2048;
					light.shadowMapHeight = 2048;

					Escenario.add( light );
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
			}
			$('#show_figure2').click(function(){crear_plano();});
			function animacion(){
					requestAnimationFrame(animacion);
					render_modelo();
					stats.update();
					/* if(teclado.pressed("a")){
						object.position.x-=10;
					}
					if(teclado.pressed("d") || mov_der==1){
						object.position.x+=10;
					} */
			}
			function render_modelo(){
					controls.update();
					Figura.rotation.y=Figura.rotation.y+0.01;
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
			}
			$('#show_clone').click(function(){modelo_js();});
			
			function onDocumentMouseUp( event ) {

				event.preventDefault();

				controls.enabled = true;

				if ( INTERSECTED ) {

					plane.position.copy( INTERSECTED.position );

					SELECTED = null;

				}

				container.style.cursor = 'auto';

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
						plane.lookAt( camera.position );

					}

					container.style.cursor = 'pointer';

				} else {

					if ( INTERSECTED ) INTERSECTED.material.color.setHex( INTERSECTED.currentHex );

					INTERSECTED = null;

					container.style.cursor = 'auto';

				}

			}
			
			function onWindowResize() {

				Camara.aspect = window.innerWidth / window.innerHeight;
				Camara.updateProjectionMatrix();

				renderer.setSize( window.innerWidth*0.6, window.innerHeight*0.6 );

			}
			
			function init() {

				//camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
				//camera.position.z = 1000;

				/* controls = new THREE.TrackballControls( camera );
				controls.rotateSpeed = 1.0;
				controls.zoomSpeed = 1.2;
				controls.panSpeed = 0.8;
				controls.noZoom = false;
				controls.noPan = false;
				controls.staticMoving = true;
				controls.dynamicDampingFactor = 0.3; */

				scene = new THREE.Scene();

				scene.add( new THREE.AmbientLight( 0x505050 ) );

				var light = new THREE.SpotLight( 0xffffff, 1.5 );
				light.position.set( 0, 500, 2000 );
				light.castShadow = true;

				light.shadowCameraNear = 200;
				light.shadowCameraFar = camera.far;
				light.shadowCameraFov = 50;

				light.shadowBias = -0.00022;

				light.shadowMapWidth = 2048;
				light.shadowMapHeight = 2048;

				scene.add( light );

				var geometry = new THREE.BoxGeometry( 40, 40, 40 );

				for ( var i = 0; i < 200; i ++ ) {

					var object = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial( { color: Math.random() * 0xffffff } ) );

					object.position.x = Math.random() * 1000 - 500;
					object.position.y = Math.random() * 600 - 300;
					object.position.z = Math.random() * 800 - 400;

					object.rotation.x = Math.random() * 2 * Math.PI;
					object.rotation.y = Math.random() * 2 * Math.PI;
					object.rotation.z = Math.random() * 2 * Math.PI;

					object.scale.x = Math.random() * 2 + 1;
					object.scale.y = Math.random() * 2 + 1;
					object.scale.z = Math.random() * 2 + 1;

					object.castShadow = true;
					object.receiveShadow = true;

					scene.add( object );

					objects.push( object );

				}

				plane = new THREE.Mesh(
					new THREE.PlaneBufferGeometry( 2000, 2000, 8, 8 ),
					new THREE.MeshBasicMaterial( { visible: false } )
				);
				scene.add( plane );

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setClearColor( 0xf0f0f0 );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				renderer.sortObjects = false;

				renderer.shadowMap.enabled = true;
				renderer.shadowMap.type = THREE.PCFShadowMap;

				container.appendChild( renderer.domElement );

				var info = document.createElement( 'div' );
				info.style.position = 'absolute';
				info.style.top = '10px';
				info.style.width = '100%';
				info.style.textAlign = 'center';
				info.innerHTML = '<a href="http://threejs.org" target="_blank">three.js</a> webgl - draggable cubes';
				container.appendChild( info );

				stats = new Stats();
				stats.domElement.style.position = 'absolute';
				stats.domElement.style.top = '0px';
				container.appendChild( stats.domElement );

				renderer.domElement.addEventListener( 'mousemove', onDocumentMouseMove, false );
				renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
				renderer.domElement.addEventListener( 'mouseup', onDocumentMouseUp, false );

				//

				window.addEventListener( 'resize', onWindowResize, false );

			}
			
			
			
			
			
			
			
			
			
			
			/**************************llamado a las funciones ******************/
			

			inicio();
			animacion();