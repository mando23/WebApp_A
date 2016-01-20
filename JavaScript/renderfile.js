

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
	var Ancho=window.innerWidth*.65;
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
	var remove = false;
	var ok1 = true;
	var bChasis = false;
	var count = 0;
	var objects = [];
	var checkUpMatrix = [18];
		for(var m = 0; m < 18; m++){
			checkUpMatrix[m] = [7];
		}
	var bPiso = true;
	var actual2 = 0;
	var PartCode;
	var PositionX;
	var PositionZ;
	var BlockType;
	var actual = 0;
	var luz, luz2;
	var last;
	var bajar = 60;
	//var teclado = new THREEx.KeyboardState();
	//La cámara
	var Camara=new THREE.PerspectiveCamera(Angulo,Aspecto,cerca,lejos);
	
	var loader = new THREE.JSONLoader();
	
	var arrayBlock = [];
	var arrayBlockCounter = 0;
	
	function Block(PartCode, Type, Color, PosX, PosZ, objHeight, objLength){
		
		this.PartCode = PartCode;
		this.Type = Type;
		this.Color = Color;
		this.PosX = PosX;
		this.PosZ = PosZ;
		this.objHeight = objHeight;
		this.objLength = objLength;
		
	}
	
	function Block(PartCode, Type, Color, BlockType){
		
		this.PartCode = PartCode;
		this.Type = Type;
		this.Color = Color;
		this.BlockType = BlockType;
	}

/* 	function Block(PartCode, Type, Color ){
		
		this.PartCode = PartCode;
		this.Type = Type;
		this.Color = Color;
	} */

	function objToString (obj) {
    var str = '';
	str += "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
			"<LegoCar \n"+
			"xmlns:xsi=\"URI\" \n"+
			"xsi:noNamespaceSchemaLocation=\"LegoCarSchemaDef.xsd\">\n\n" +
			
			//Descubrir como hacer el numero de orden
			
			"<OrderID>000123</OrderID>\n";
			
	//str += '<' + obj[Type] + '>';
	
	
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
			if(p == "Type")
				str += '<'+ obj[p] + '>'+ '\n';
        }
    }
	
	for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
			if(p == "PartCode" || p == "PosX" || p == "PosZ" || p == "BlockType"){
				str += '     <'+ p + '>' + obj[p] + '<'+'/'+ p + '>'+'\n';
			}    
        }
    }

    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
			if(p == "Type")
				str += '</'+ obj[p] + '>'+ '\n';
        }
    }	
	
    return str;
}
	function inicio(){
			//Tamaño del render(resultado)
			Render.setSize(Ancho,Alto);
			//Se agrega el render al documento html
			container = document.getElementById('render').appendChild(Render.domElement);
			//Acercamos la cámara en z es profundidad para ver el punto
			Camara.position.z=220;
			Camara.position.y=100;
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
			crear_plano();
			// cargar nuevos modelos
			// agregamos todo el escenario y la cámara al render
			controls=new THREE.OrbitControls(Camara,Render.domElement);
				
			projector = new THREE.Projector();
			
			document.addEventListener( 'mousedown', onDocumentMouseDown, false);

	}
	
	function onDocumentMouseDown( event ){
		
		event.preventDefault();
		
		console.log("Click.");
		
		mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		mouse.y = (- ( event.clientY / window.innerHeight ) * 2 + 1);
		
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
	
	function crear_plano(){
			//Geometría del plano
			Geometria_plano=new THREE.CylinderGeometry(100,100,10,100);
			//Textura
			Textura_plano=new THREE.ImageUtils.loadTexture("Figures/cesped.jpg");
			Textura_plano.wrapS=Textura_plano.wrapT=THREE.RepeatWrapping;
			Textura_plano.repeat.set(10,10);
			// Material y agregado la textura
			Material_plano=new THREE.MeshBasicMaterial({map:Textura_plano,side:THREE.DoubleSide});
			// El plano (Territorio)
			Territorio=new THREE.Mesh(Geometria_plano,Material_plano);
			Territorio.rotation.y=-0.5
			Territorio.castShadow = true;
			Territorio.receiveShadow = true;
			Territorio.position.y=-3;
			Escenario.add(Territorio);
			/* objects.push(Territorio);
			count++; */
	}

	function animacion(){
			requestAnimationFrame(animacion);
			if( izq ){
				if(!ok1 && object.position.x > -63 && BlockType == 221){
					
							object.position.x-=16;
					
				} else 	if(!ok1 && object.position.x > -63 && BlockType == 222){
					
							object.position.x-=16;
					
				}else if(!ok1 && object.position.x > -46 && BlockType == 241){
					
							object.position.x-=16;
					
				} else 	if((!ok1 && object.position.x > -95 && BlockType == 242)||
						   (!ok1 && object.position.x > -127 && BlockType == 261)||
						   (!ok1 && object.position.x > -127 && BlockType == 281)){
					
							object.position.x-=16;
					
				}
							
				izq = false;
			}
			
			if( der ){
				if((!ok1 && object.position.x < 31 && BlockType == 222)||
				   (!ok1 && object.position.x < 31 && BlockType == 261)||
				   (!ok1 && object.position.x < 31 && BlockType == 281)){
					
					object.position.x+=16;
					
				} else	if(!ok1 && object.position.x < -33 && BlockType == 221){
							
							object.position.x+=16;
				
				} else if(!ok1 && object.position.x < 77 && BlockType == 241){
					
							object.position.x+=16;
							
				} else	if(!ok1 && object.position.x < 31 && BlockType == 242){
							
							object.position.x+=16;
				
				}
				der = false;
			}
						
			if ( ok ){
				if ( !ok1 ){
					if(BlockType == 222 || BlockType == 242 || BlockType == 261 || BlockType == 281){
					switch(object.position.x){
						case 0:
						case -0.5:
							actual2 = 8;
							PosYOk(actual2); 
							break;
						
						case 16:
						//alert("entro a ok en 16");
							actual2 = 9;
							//alert("ya tiene el valor de 9");
							PosYOk(actual2); 
							//alert("salio de posyok ");
							break;
							
						case 32:
							actual2 = 10;
							PosYOk(actual2); 
							break;
						
						case -16:
							actual2 = 7;
							PosYOk(actual2); 
							break;
							
						case -32:
							actual2 = 6;
							PosYOk(actual2); 
							break;
							
						case -48:
							actual2 = 5;
							PosYOk(actual2); 
							break;
						
						case -64:
							actual2 = 4;
							PosYOk(actual2); 
							break;
							
						case -80:
							actual2 = 3;
							PosYOk(actual2); 
							break;
							
						case -96:
							actual2 = 2;
							PosYOk(actual2); 
							break;
							
						case -112:
							actual2 = 1;
							PosYOk(actual2); 
							break;
							
						case -128:
							actual2 = 0;
							PosYOk(actual2); 
							break;
							
					}	
/* 							object.position.y-=bajar;
					bajar-=9; */
					ok1 = true;
				} else if (BlockType == 221){
					switch(object.position.x){
						case 0:
							actual2 = 8;
							PosYOk(actual2); 
							break;
						
						case -48:
							actual2 = 9;
							PosYOk(actual2); 
							break;
							
						case -32:
							actual2 = 10;
							PosYOk(actual2); 
							break;
						
						case -80:
							actual2 = 7;
							PosYOk(actual2); 
							break;
							
						case -96:
							actual2 = 6;
							PosYOk(actual2); 
							break;
							
						case -112:
							actual2 = 5;
							PosYOk(actual2); 
							break;
						
						case -128:
							actual2 = 4;
							PosYOk(actual2); 
							break;
							
						
					}	
/* 							object.position.y-=bajar;
					bajar-=9; */
					ok1 = true;
					
				}else if (BlockType == 241){
					switch(object.position.x){
						case 46:
							actual2 = 8;
							PosYOk(actual2); 
							break;
						
						case 62:
							actual2 = 9;
							PosYOk(actual2); 
							break;
							
						case 78:
							actual2 = 10;
							PosYOk(actual2); 
							break;
						
						case 30:
							actual2 = 7;
							PosYOk(actual2); 
							break;
							
						case 14:
							actual2 = 6;
							PosYOk(actual2); 
							break;
							
						case -2:
							actual2 = 5;
							PosYOk(actual2); 
							break;
						
						case -18:
							actual2 = 4;
							PosYOk(actual2); 
							break;
							
						case -34:
							actual2 = 3;
							PosYOk(actual2); 
							break;
							
						case -50:
							actual2 = 2;
							PosYOk(actual2); 
							break;
					}	
/* 							object.position.y-=bajar;
					bajar-=9; */
					ok1 = true;
					
				}
				
				}
			ok = false;
			}
			
			render_modelo();
			
			
	}
	
	function render_modelo(){
			controls.update();
			Render.render(Escenario,Camara);
	}
	
	function modelo_chasis(modelo_color){
		if( ok1 ){
		bChasis = true;
		PartCode = 6048908;
		for( m = 0; m < 6; m++){
			var n = 5+m;
			checkUpMatrix[n][0] = 1;	
			//actual = checkUpMatrix[n][0]
			//alert(actual);
		}			
		//ok1 = false;
		loader.load('JavaScript/chasis.json',
		function (geometry){
			
			Material_modelo=new THREE.MeshLambertMaterial({color:modelo_color});
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
		

		
			//Crea el objeto de Chasis en el arreglo de bloques
			arrayBlock[arrayBlockCounter] = new Block(PartCode, "Chassis", modelo_color, "Normal");
			//alert(arrayBlock[arrayBlockCounter].PartCode);
		
			var array_demo = objToString(arrayBlock[arrayBlockCounter]);
			alert(array_demo);
			ajaxSend(array_demo);
		
/* 		var parseXml;

		if (window.DOMParser) {
			parseXml = function(xmlStr) {
				return ( new window.DOMParser() ).parseFromString(xmlStr, "text/xml");
			};
		} else if (typeof window.ActiveXObject != "undefined" && new window.ActiveXObject("Microsoft.XMLDOM")) {
			parseXml = function(xmlStr) {
				var xmlDoc = new window.ActiveXObject("Microsoft.XMLDOM");
				xmlDoc.async = "false";
				xmlDoc.loadXML(xmlStr);
				return xmlDoc;
			};
		} else {
			parseXml = function() { return null; }
		}

		var xmlDoc = parseXml("<text>" + arrayBlock[arrayBlockCounter].PartCode + "</text>");
		if (xmlDoc) {
			//window.alert(xmlDoc.documentElement.nodeName);
		} */



		
/* 			var xReq = new XMLHttpRequest();
			xReq.open("GET", "demo.xml", true);
			xReq.responseXML;
			xReq.send();
			//alert(xReq.documentElement.nodeValue);
			
			var s = new XMLSerializer();
			var d = arrayBlock[arrayBlockCounter].toXMLtext; */
			//var str = s.serializeToString(d);
			//alert(str);

/* 		var myObject = arrayBlock[arrayBlockCounter];
		var recursiveEncoded = $.param( myObject );
		var recursiveDecoded = decodeURIComponent( $.param( myObject ) );
		 
		alert( recursiveEncoded );
		alert( recursiveDecoded ); */			
			
			
			//Aumenta el counter para la posicion dentro del arreglo de bloques
			arrayBlockCounter++;
		

		
			
	}
	
	modelo_llanta();
	modelo_rin();
	}
	
	function modelo_llanta(){
		
		loader.load('JavaScript/modelo_llanta.json',
		function (geometry){
			
			Material_modelo=new THREE.MeshLambertMaterial({color:0X000000});
			object = new THREE.Mesh(geometry, Material_modelo);
				
			object.position.x =50;
			object.position.y =-4;
			object.position.z =-16;
			object.rotation.y +=45 * Math.PI / 18;
		
			object.castShadow = false;
			object.receiveShadow = false;
			Escenario.add(object);

			
			object.scale.x=1;
			object.scale.y=1;
			object.scale.z=1;
			
		
			;
		});
		
		modelo_llanta2();
	}
	
	function modelo_llanta2(){
		
		loader.load('JavaScript/modelo_llanta.json',
		function (geometry){
			
			Material_modelo=new THREE.MeshLambertMaterial({color:0X000000});
			object = new THREE.Mesh(geometry, Material_modelo);
				
			object.position.x =98;
			object.position.y =-4;
			object.position.z =-16;
			object.rotation.y +=45 * Math.PI / 18;
		
			object.castShadow = false;
			object.receiveShadow = false;
			Escenario.add(object);

			
			object.scale.x=1;
			object.scale.y=1;
			object.scale.z=1;
			
		
			;
		});
		
		modelo_llanta3();
	}
	
	function modelo_llanta3(){
		
		loader.load('JavaScript/modelo_llanta.json',
		function (geometry){
			
			Material_modelo=new THREE.MeshLambertMaterial({color:0X000000});
			object = new THREE.Mesh(geometry, Material_modelo);
				
			object.position.x =50;
			object.position.y =-4;
			object.position.z =30;
			object.rotation.y +=45 * Math.PI / 18;
		
			object.castShadow = false;
			object.receiveShadow = false;
			Escenario.add(object);

			
			object.scale.x=1;
			object.scale.y=1;
			object.scale.z=1;
			
		
			;
		});
		
		modelo_llanta4();
	}	
	
	function modelo_llanta4(){
		
		loader.load('JavaScript/modelo_llanta.json',
		function (geometry){
			
			Material_modelo=new THREE.MeshLambertMaterial({color:0X000000});
			object = new THREE.Mesh(geometry, Material_modelo);
				
			object.position.x =98;
			object.position.y =-4;
			object.position.z =30;
			object.rotation.y +=45 * Math.PI / 18;
		
			object.castShadow = false;
			object.receiveShadow = false;
			Escenario.add(object);

			
			object.scale.x=1;
			object.scale.y=1;
			object.scale.z=1;
			
		
			;
		});
		
	}	
	
	function modelo_rin(){
		
		loader.load('JavaScript/modelo_rin.json',
		function (geometry){
			
			Material_modelo=new THREE.MeshLambertMaterial({color:0XC9C0BB});
			object = new THREE.Mesh(geometry, Material_modelo);
				
			object.position.x =50;
			object.position.y =-4;
			object.position.z =-16;
			object.rotation.y +=45 * Math.PI / 18;
		
			object.castShadow = false;
			object.receiveShadow = false;
			Escenario.add(object);

			
			object.scale.x=1;
			object.scale.y=1;
			object.scale.z=1;
			
		
			;
		});
		
		modelo_rin2();
	}
	
	function modelo_rin2(){
		
		loader.load('JavaScript/modelo_rin.json',
		function (geometry){
			
			Material_modelo=new THREE.MeshLambertMaterial({color:0XC9C0BB});
			object = new THREE.Mesh(geometry, Material_modelo);
				
			object.position.x =98;
			object.position.y =-4;
			object.position.z =-16;
			object.rotation.y +=45 * Math.PI / 18;
		
			object.castShadow = false;
			object.receiveShadow = false;
			Escenario.add(object);

			
			object.scale.x=1;
			object.scale.y=1;
			object.scale.z=1;
			
		
			;
		});
		
		modelo_rin3();
	}
	
	function modelo_rin3(){
		
		loader.load('JavaScript/modelo_rin.json',
		function (geometry){
			
			Material_modelo=new THREE.MeshLambertMaterial({color:0XC9C0BB});
			object = new THREE.Mesh(geometry, Material_modelo);
				
			object.position.x =50;
			object.position.y =-4;
			object.position.z =30;
			object.rotation.y +=45 * Math.PI / 18;
		
			object.castShadow = false;
			object.receiveShadow = false;
			Escenario.add(object);

			
			object.scale.x=1;
			object.scale.y=1;
			object.scale.z=1;
			
		
			;
		});
		
		modelo_rin4();
	}	
	
	function modelo_rin4(){
		
		loader.load('JavaScript/modelo_rin.json',
		function (geometry){
			
			Material_modelo=new THREE.MeshLambertMaterial({color:0XC9C0BB});
			object = new THREE.Mesh(geometry, Material_modelo);
				
			object.position.x =98;
			object.position.y =-4;
			object.position.z =30;
			object.rotation.y +=45 * Math.PI / 18;
		
			object.castShadow = false;
			object.receiveShadow = false;
			Escenario.add(object);

			
			object.scale.x=1;
			object.scale.y=1;
			object.scale.z=1;
			
		
			;
		});
		
	}	
		
	function modelo_221(modelo_color){
		if( ok1 ){
		ok1 = false;
		PartCode = 4168579;
		BlockType = 221;
		loader.load('JavaScript/modelo_221.json',
		function (geometry){
			
			Material_modelo=new THREE.MeshLambertMaterial({color:modelo_color});
			object = new THREE.Mesh(geometry, Material_modelo);
				
				object.position.x =0;
				object.position.y =93.5;
				object.position.z =-14.5;
			
				object.castShadow = false;
				object.receiveShadow = false;
				Escenario.add(object);
				objects.push(object);
				count++;
			
			object.scale.x=1;
			object.scale.y=1;
			object.scale.z=1;
			object.length = 2;
			object.height = 1;
			arrayBlock[arrayBlockCounter].objLength = object.length;
			arrayBlock[arrayBlockCounter].objHeight = object.height;
			;
		});
		
	}
		
		//Crea el objeto de Chasis en el arreglo de bloques
		arrayBlock[arrayBlockCounter] = new Block(PartCode, BlockType, modelo_color);
	}
	
	function modelo_222(modelo_color){
		if( ok1 ){
		ok1 = false;
		PartCode = 4168579;
		BlockType = 222;
		loader.load('JavaScript/modelo_222.json',
		function (geometry){
			
			Material_modelo=new THREE.MeshLambertMaterial({color:modelo_color});
			object = new THREE.Mesh(geometry, Material_modelo);
				
				object.position.x =0;
				object.position.y =94.1;
				object.position.z =-14.5;
				object.rotation.x +=90 * Math.PI / 18;
			
				object.castShadow = false;
				object.receiveShadow = false;
				Escenario.add(object);
				objects.push(object);
				count++;
			
			object.scale.x=1;
			object.scale.y=1;
			object.scale.z=1;
			object.length = 2;
			object.height = 2;
			arrayBlock[arrayBlockCounter].objLength = object.length;
			arrayBlock[arrayBlockCounter].objHeight = object.height;
			;
		});
		
	}
		
		//Crea el objeto de Chasis en el arreglo de bloques
		arrayBlock[arrayBlockCounter] = new Block(PartCode, "LegoBlock", modelo_color,"Normal");
		alert (arrayBlock[arrayBlockCounter].BlockType);
		var array_demo = objToString(arrayBlock[arrayBlockCounter]);
		alert(array_demo);
	}	

	function modelo_241(modelo_color){
		if( ok1 ){
		ok1 = false;
		PartCode = 4168579;
		BlockType = 241;
		loader.load('JavaScript/modelo_241.json',
		function (geometry){
			
			Material_modelo=new THREE.MeshLambertMaterial({color:modelo_color});
			object = new THREE.Mesh(geometry, Material_modelo);
				
				object.position.x =46;
				object.position.y =36.5;
				object.position.z =-17.5;
			
				object.castShadow = false;
				object.receiveShadow = false;
				Escenario.add(object);
				objects.push(object);
				count++;
			
			object.scale.x=1;
			object.scale.y=1;
			object.scale.z=1;
			object.length = 4;
			object.height = 1;
			arrayBlock[arrayBlockCounter].objLength = object.length;
			arrayBlock[arrayBlockCounter].objHeight = object.height;
			;
		});
		
	}
		
		//Crea el objeto de Chasis en el arreglo de bloques
		arrayBlock[arrayBlockCounter] = new Block(PartCode, "LegoBlock", modelo_color);
	}
	
	function modelo_242(modelo_color){
		if( ok1 ){
		ok1 = false;
		PartCode = 4168579;
		BlockType = 242;
		loader.load('JavaScript/modelo_242.json',
		function (geometry){
			
			Material_modelo=new THREE.MeshLambertMaterial({color:modelo_color});
			object = new THREE.Mesh(geometry, Material_modelo);
				
				object.position.x =0;
				object.position.y =29;
				object.position.z =-90;
			
				object.castShadow = false;
				object.receiveShadow = false;
				Escenario.add(object);
				objects.push(object);
				count++;
			
			object.scale.x=1;
			object.scale.y=1;
			object.scale.z=1;
			object.length = 4;
			object.height = 2;
			arrayBlock[arrayBlockCounter].objLength = object.length;
			arrayBlock[arrayBlockCounter].objHeight = object.height;
			;
		});
		
	}
		
		//Crea el objeto de Chasis en el arreglo de bloques
		arrayBlock[arrayBlockCounter] = new Block(PartCode, "LegoBlock", modelo_color);
	}	
	
	function modelo_261(modelo_color){
		if( ok1 ){
		ok1 = false;
		PartCode = 4168579;
		BlockType = 261;
		loader.load('JavaScript/modelo_261.json',
		function (geometry){
			
			Material_modelo=new THREE.MeshLambertMaterial({color:modelo_color});
			object = new THREE.Mesh(geometry, Material_modelo);
				
				object.position.x =0;
				object.position.y =93.3;	//29
				object.position.z =-14.5;	//-90
				object.rotation.x +=90 * Math.PI / 18;
			
				object.castShadow = false;
				object.receiveShadow = false;
				Escenario.add(object);
				objects.push(object);
				count++;
			
			object.scale.x=1.01;
			object.scale.y=1.01;
			object.scale.z=1;
			object.length = 6;
			object.height = 1;
			arrayBlock[arrayBlockCounter].objLength = object.length;
			arrayBlock[arrayBlockCounter].objHeight = object.height;
			;
		});
		
	}
		
		//Crea el objeto de Chasis en el arreglo de bloques
		arrayBlock[arrayBlockCounter] = new Block(PartCode, "LegoBlock", modelo_color);
	}

	function modelo_281(modelo_color){
		if( ok1 ){
		ok1 = false;
		PartCode = 4168579;
		BlockType = 281;
		loader.load('JavaScript/modelo_281.json',
		function (geometry){
			
			Material_modelo=new THREE.MeshLambertMaterial({color:modelo_color});
			object = new THREE.Mesh(geometry, Material_modelo);
				
				object.position.x =0;
				object.position.y =93.3;	//29
				object.position.z =-14.5;	//-90
				object.rotation.x +=90 * Math.PI / 18;
			
				object.castShadow = false;
				object.receiveShadow = false;
				Escenario.add(object);
				objects.push(object);
				count++;
			
			object.scale.x=1.01;
			object.scale.y=1.01;
			object.scale.z=1;
			object.length = 8;
			object.height = 1;
			arrayBlock[arrayBlockCounter].objLength = object.length;
			arrayBlock[arrayBlockCounter].objHeight = object.height;
			;
		});
		
	}
		
		//Crea el objeto de Chasis en el arreglo de bloques
		arrayBlock[arrayBlockCounter] = new Block(PartCode, "LegoBlock", modelo_color);
	}
	
	function rem_3(){
		alert("entro a rem");
	if (count != 0)
	count--;
	var first = objects[count];	
	Escenario.remove(first);
	objects.pop();
	if( !ok1 )
		ok1 = true;
	
	if (arrayBlockCounter != 0)
	arrayBlockCounter--;
	var first = arrayBlock[arrayBlockCounter];	
	alert("PartCode" + first.PartCode + "BlockType" + first.Type + "Color" + first.Color+ 
		  "PosX " + first.PosX + " PosZ " + first.PosZ + " Heigth " + first.objHeight+ 
		  " Length " + first.objLength );
	
	delete(arrayBlock[arrayBlockCounter]);
	
	var maxX = first.PosX + first.objLength;
	var maxZ = first.PosZ + first.objHeight;
	
	alert("MaxX " + maxX + " MaxZ " + maxZ );
	
	//For para escribir la posicion de la pieza en las filas de la matriz
	for(var h = 0; h< object.height; h++){
		//For para escribir la posicion de la pieza en las columnas de la matriz
		for(var j = 0; j< object.length; j++){
			
			//Escritura de la posicion exacta dentro de la matriz
			//Value es la variable con la posicion de la primer columna de la pieza
			//j es la variable para recorrer las posicion en longitud de la pieza
			//i-1 es la variable del piso actual a la que la pieza se va a posicionar
			//h es la variable de la altura de la pieza
			
			checkUpMatrix[first.PosX+j][first.PosZ+h] = 0;
			alert("checkUpMatrix borrado en x " + first.PosX +"+"+ j +" Y es "+first.PosZ + "+" + h);
			
			
			
			
		}		

	}	
	
	
	
	
	
	}

	function PosYOk(value){
		//alert("entro de posyok ");
		//alert(value);
				// For para verificar filas en la altura del carro
				for(var i = 0; i <= 7; i++){
					//alert("entro al 1er for de posyok ");
					//alert("i es " + i);
					// bPiso es la variable de confirmacion
					bPiso = true;
					
					//For para verificar la longitud de la parte en el carro
					for(var j = 0; j < object.length; j++){
						//alert("entro a segundo for de posyok ");
						//alert("j es " + j);
						
						//Si encuentra la matriz ocupada bPiso se hace falso significando que el lugar esta ocupado
						if(checkUpMatrix[value+j][i]==1){
							//alert("checkUpMatrix " + value + j +i);
							bPiso = false;
							break;
							
						}
						
					}
					
					//Se verifica si despues del for de longitud la pieza esta disponible para esa posicion
					if(bPiso == true){
						
						//Se rectifica el valor del piso al que se va a ensamblar la pieza
						//Esto se hace para multiplicar el valor de 'actual' * 9 y cambiar la posicion
						//de la pieza con respecto a Z en la aplicacion y por incremento de 1 piso con el chasis
						actual = i-1;
						//alert("actual es " + actual);
						
						PositionX = value;

					

					

						
						
						
						//For para escribir la posicion de la pieza en las filas de la matriz
						for(var h = 0; h< object.height; h++){
							//For para escribir la posicion de la pieza en las columnas de la matriz
							for(var j = 0; j< object.length; j++){
								
								//Escritura de la posicion exacta dentro de la matriz
								//Value es la variable con la posicion de la primer columna de la pieza
								//j es la variable para recorrer las posicion en longitud de la pieza
								//i-1 es la variable del piso actual a la que la pieza se va a posicionar
								//h es la variable de la altura de la pieza
								
								checkUpMatrix[value+j][i+h] = 1;
								//alert("checkUpMatrix escrito en x " + value +"+"+ j +" Y es "+i + "+" + h);
								
								
								
								
							}
							
							PositionZ = i+h;
							if(object.height== 2){
					
								PositionZ --;
					
							}
							
							
						}break;
						
						
					}
					
					
				}
				

				
				//var a = object.length;
				arrayBlock[arrayBlockCounter].PosX = PositionX;
				//a = 0;
				//a = object.height;
				arrayBlock[arrayBlockCounter].PosZ = PositionZ;
				//a = 0;
			
				//alert("PartCode" + arrayBlock[arrayBlockCounter].PartCode + "BlockType" + arrayBlock[arrayBlockCounter].Type + "Color" + arrayBlock[arrayBlockCounter].Color+ "PosX " + arrayBlock[arrayBlockCounter].PosX + " PosZ " + arrayBlock[arrayBlockCounter].PosZ + " Heigth " + arrayBlock[arrayBlockCounter].objHeight+ " Length " + arrayBlock[arrayBlockCounter].objLength );
				//alert("actual es " + actual);
				if(object.height== 2){
					
					actual++;
					
				}
				//alert("actual es " + actual);
				
				if(arrayBlock[arrayBlockCounter].PosZ <= 1){
					
					object.position.y-= bajar-(9*actual);
					
				} else {
					
					object.position.y-= bajar-(9*actual)-1;
					
				}
				
				if(BlockType == 261 || BlockType == 281){
					
					object.position.x += 1;
					object.position.y += 0.5;
					
				}
				
				
				actual = 0;
				actual2 = 0;
				
				//arrayBlock[arrayBlockCounter] = new Block(PartCode, BlockType, "0xff0000",PositionX, PositionZ);
				
 				var array_demo2 = objToString(arrayBlock[arrayBlockCounter]);
				alert(array_demo2);
				ajaxSend(array_demo2);
				
				var myObject = arrayBlock[arrayBlockCounter];
				var recursiveEncoded = $.param( myObject );
				var recursiveDecoded = decodeURIComponent( $.param( myObject ) );
				 
				alert( recursiveEncoded );
				alert( recursiveDecoded );
				
				var recursiveEncoded = $.param( objToString(arrayBlock[arrayBlockCounter]) );
				var recursiveDecoded = decodeURIComponent( $.param( array_demo2 ) );
				 
				alert( recursiveEncoded );
				alert( recursiveDecoded );	 			
				
				
				//Aumenta el counter para la posicion dentro del arreglo de bloques
				arrayBlockCounter++;
						
			
	}	
		
	function ajaxSend(send){
		// Create our XMLHttpRequest object
		var hr = new XMLHttpRequest();
		// Create some variables we need to send to our PHP file
		var url = "ajaxphp2.php";
		var vars = send;
		hr.open("POST", url, true);
		// Set content type header information for sending url encoded variables in the request
		hr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		// Access the onreadystatechange event for the XMLHttpRequest object
		hr.onreadystatechange = function() {
		  if(hr.readyState == 4 && hr.status == 200) {
			var return_data = hr.responseText;
			document.getElementById("status").innerHTML = return_data;
			}
		}
		// Send the data to PHP now... and wait for response to update the status div
		hr.send(vars); // Actually execute the request

  }
				
	function ajaxBlock212(){
		// Create our XMLHttpRequest object
		var hr = new XMLHttpRequest();
		// Create some variables we need to send to our PHP file
		var url = "ajaxphp2.php";
		var vars = array_demo2;
		hr.open("POST", url, true);
		// Set content type header information for sending url encoded variables in the request
		hr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		// Access the onreadystatechange event for the XMLHttpRequest object
		hr.onreadystatechange = function() {
		  if(hr.readyState == 4 && hr.status == 200) {
			var return_data = hr.responseText;
		  document.getElementById("status").innerHTML = return_data;
			}
		}
		// Send the data to PHP now... and wait for response to update the status div
		hr.send(vars); // Actually execute the request

  }
	
	$('#show_chasisR').click(function(){modelo_chasis(0Xff0000);});
	
	$('#show_chasisV').click(function(){modelo_chasis(0X24c51b);});

	$('#show_chasisA').click(function(){modelo_chasis(0X0000ff);});	
	
	$('#show_body_2x2x2_R').click(function(){modelo_222(0Xff0000);});
	
	$('#show_body_2x2x2_V').click(function(){modelo_222(0X24c51b);});

	$('#show_body_2x2x2_A').click(function(){modelo_222(0Xffff00);});
	
	$('#show_body_2x4x2_R').click(function(){modelo_242(0Xff0000);});
	
	$('#show_body_2x4x2_V').click(function(){modelo_242(0X24c51b);});
	
	$('#show_body_2x4x2_A').click(function(){modelo_242(0X0000ff);});

	$('#show_body_2x4x1_A').click(function(){modelo_241(0Xffff00);});
	
	$('#show_body_2x4x1_V').click(function(){modelo_241(0X24c51b);});
	
	$('#show_body_2x6_1_A').click(function(){modelo_261(0X0000ff);});
	
	$('#show_body_2x8x1_V').click(function(){modelo_281(0X24c51b);});

	$('#show_techo_2x3x2_A').click(function(){rem_3();});

	
	inicio();
	animacion();	
	