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
			/**************************llamado a las funciones ******************/
			

			inicio();
			animacion();
			//modelo_js();
			//crear_plano();
		//Se agrega modelo collada	
		/* 	Modelo3DDAE=new THREE.ColladaLoader();
			Modelo3DDAE.load("model.dae",AgregarDae);
			
			function AgregarDae(infodae){
			
				modeloDaeFinal=infodae.scene;
				modeloDaeFinal.position.set(10,10,10);
				modeloDaeFinal.scale.x=modeloDaeFinal.scale.y=modeloDaeFinal.scale.z=.5;
				modeloDaeFinal.rotation.y=Math.PI;
				scene.add(modeloDaeFinal);
			
			} */
			
			

			
			
			
////////////////////////////////






	/******************************* variables ******************
			//Preparamos el render
			var Render=new THREE.WebGLRenderer();
			//El escenario
			var Escenario=new THREE.Scene();
			
			// la Figura 
			var Figura;
			var controls;
			var Ancho=window.innerWidth*0.6;
			var Alto=window.innerHeight*0.6;
			
			var Angulo = 45;	
			var Aspecto=Ancho/Alto;
			var cerca=0.1;
			var lejos=10000;
			//La cámara
			var Camara=new THREE.PerspectiveCamera(Angulo,Aspecto,cerca,lejos);
			
			// textura la misma indicación que maneja la figura
			var textura = new THREE.ImageUtils.loadTexture(src="https://github.com/Develoteca/threejs/blob/gh-pages/Ejercicios/cap5y6/texturas/muro.jpg");
			
			// textura la misma indicación que maneja las figuras geometricas
			var textura_geometrias = new THREE.ImageUtils.loadTexture(src="https://github.com/Develoteca/threejs/blob/gh-pages/Ejercicios/cap5y6/texturas/muro.jpg");
			var material_geometrias = new THREE.MeshBasicMaterial({map:textura_geometrias,side:THREE.DoubleSide,wireframe:false});
			
			// textura la misma indicación que maneja el plano
			var textura_plano = new THREE.ImageUtils.loadTexture(src="https://github.com/Develoteca/threejs/blob/gh-pages/Ejercicios/cap5y6/texturas/cesped.jpg");
			
			
			THREEx.WindowResize(Render,Camara);
			/******************************* inicio ******************
			function inicio(){
					//Tamaño del render(resultado)
					Render.setSize(Ancho,Alto);
					//Se agrega el render al documento html
					document.getElementById('render').appendChild(Render.domElement);
					//Acercamos la cámara en z es profundidad para ver el punto
					Camara.position.z=100;
					Camara.position.y=100;
					Camara.rotation.y=Math.PI;
					
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
					var vertices=[[2,7,0],[7,2,0],[12,7,0],[12,17,0],[7,12,0],[2,17,0],[2,7,0]];
					
					var long_vertices=vertices.length;
					var array_extrude=[];
					
					for(i=0;i<long_vertices;i++){
							x=vertices[i][0];
							y=vertices[i][1];
							z=vertices[i][2];
							//Agregamos vértices al vector
							Vector=new THREE.Vector3(x,y,z);
							//Agregamos el vector a la geometría
							Geometria.vertices.push(Vector);   
							array_extrude.push(Vector);
					}
					
					// figura
					var forma_figura=new THREE.Shape(array_extrude);
					
					// extrusión 
					var datos_extrusion={
										amount:10, //cantidad de profundidad 
										bevelEnabled:false, // activando bisel
										bevelSegments:1, // segmentos del bisel
										steps:10, // "profundidad y Núm. de segmentos que marcan la profundidad“
										bevelThickness:100 // grosor del bisel
										};
					
					var extrude_geometria=new THREE.ExtrudeGeometry(forma_figura,datos_extrusion);
					//repetir la textura figura
					textura.repeat.set(0.06,0.06);
					//repetir la textura de la figura
					textura.wrapS = textura.wrapT = THREE.repeatWrapping;
					//Material de la figura
					var material = new THREE.MeshBasicMaterial({map:textura,side:THREE.DoubleSide,wireframe:false});
					// la malla 
					var mallaextrusion=new THREE.Mesh(extrude_geometria,material);
					// agregamos un material para que el punto tenga color
					Material=new THREE.ParticleBasicMaterial({color:0XFF0000});
					// creamos una partícula con la geometría y el material
					Figura=new THREE.Line(Geometria,Material);
					// agregamos la partícula al escenario
					Escenario.add(Figura);
					Escenario.add(mallaextrusion);
			}
			$('#figura').click(function(){cargar_modelo();});
			function crear_plano(){
					//Geometría del plano
					Geometria_plano=new THREE.PlaneGeometry(100,100,10,10);
					//Textura
					
					textura_plano.wrapS=textura_plano.wrapT=THREE.RepeatWrapping;
					textura_plano.repeat.set(10,10);
					// Material y agregado la textura
					Material_plano=new THREE.MeshBasicMaterial({map:textura_plano,side:THREE.DoubleSide});
					// El plano (Territorio)
					Territorio=new THREE.Mesh(Geometria_plano,Material_plano);
					
					Territorio.rotation.x=Math.PI/2;
					Escenario.add(Territorio);
			}
			$('#plano').click(function(){crear_plano();});
			
			function crear_cubo(){
				//CubeGeometry(width, height, depth, widthSegments, heightSegments, depthSegments)
				geometriaCubo = new THREE.CubeGeometry( 10, 10, 10 );
				var mallacubo=new THREE.Mesh(geometriaCubo,material_geometrias);
				mallacubo.position.z=-10;
				mallacubo.position.y=5;
				Escenario.add(mallacubo);
			}
			$('#cubo').click(function(){crear_cubo();});
			
			function cargar_cilindro(){ 
				//CylinderGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded)
				geometriaCilindro=new THREE.CylinderGeometry(10, 10, 20, 100, 1, false);
				var mallaCilindro = new THREE.Mesh(geometriaCilindro,material_geometrias);	
				mallaCilindro.position.z=-40;
				mallaCilindro.position.y=5;
				Escenario.add(mallaCilindro);	  
			}
				$('#cilindro').click(function(){cargar_cilindro();});
				
			function cargar_esfera(){
				//SphereGeometry(radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength)			
				geometriaSphere=new THREE.SphereGeometry(10, 10, 10);	
				var mallaesfera = new THREE.Mesh(geometriaSphere,material_geometrias);
				mallaesfera.position.z=40;
				mallaesfera.position.y=5;
				Escenario.add(mallaesfera);
			}
				$('#esfera').click(function(){cargar_esfera();});
			function animacion(){
					requestAnimationFrame(animacion);
					render_modelo();
			}
			function render_modelo(){
					controls.update();
					Escenario.rotation.z=Escenario.rotation.z+0.02;
					Render.render(Escenario,Camara);
			}
			/**************************llamado a las funciones *****************
			inicio();
			animacion();
			cargar_cilindro();
*/