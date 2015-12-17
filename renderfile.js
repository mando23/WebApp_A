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
			var Camara=new THREE.PerspectiveCamera(Angulo,Aspecto,cerca,lejos);
			
			var loader = new THREE.JSONLoader();
			
			
			/******************************* inicio *******************/
			function inicio(){
					//Tamaño del render(resultado)
					Render.setSize(Ancho,Alto);
					//Se agrega el render al documento html
					document.getElementById('render').appendChild(Render.domElement);
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
					if(teclado.pressed("a")){
						object.position.x-=10;
					}
					if(teclado.pressed("d") || mov_der==1){
						object.position.x+=10;
					}
			}
			function render_modelo(){
					controls.update();
					//Figura.rotation.y=Figura.rotation.y+0.01;
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
			/**************************llamado a las funciones ******************/
			

			inicio();
			animacion();
			//modelo_js();
			//crear_plano();
