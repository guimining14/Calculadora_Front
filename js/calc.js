  let usuario = '';
  let usuarioId = null;

  const carregarHistorico = () => {
    $.get('http://localhost:3000/api/v1/calculo/' + usuarioId , (historico) => {
      historico.forEach(linhaHistorico => {
        inserirLinhaTabela(linhaHistorico);
      });
    })
  }

  const inserirLinhaTabela = (linhaHistorico) => {
    let corpo = $('#historicoCorpo')

    let campoOperacao = `<td>${linhaHistorico.Operacao}</td>`;
    let campoResultado = `<td>${linhaHistorico.Resultado}</td>`;

    

    let dataTemp = linhaHistorico.Data.split('T')[0];
    let arrayData = dataTemp.split('-');
    let dataFormatada = arrayData[2] + '/' + arrayData[1] + '/' + arrayData[0];
          

    let campoData = `<td>${dataFormatada}</td>`   
    let campoHora = `<td>${linhaHistorico.Data.split('T')[1].split('.')[0]}</td>`       
    let linha = `<tr>${campoOperacao}${campoResultado}${campoData}${campoHora}</tr>`;

    corpo.prepend(linha);
  }

  const logar = () => {
    usuario = $('#textUsuario').val();

    $.post('http://localhost:3000/api/v1/usuarios', {
      "Nome":usuario
    }, (obj) => {
      usuarioId = obj.Id
    $('#labelUsuarioLogado').html(usuario + '(' + usuarioId + ')');
    $('#calc').show();
    $('#header').show();
    $('#formIncluir').hide();
    $('#historico').show();
    iniciar();
    carregarHistorico();
    });
  
  }


  const calcular = (eq) => {
    $.post('http://localhost:3000/api/v1/calculo', {
      "equacao":eq, usuarioId: usuarioId
    }, (obj) => {
      let operacao = eq;
        result = obj.Resultado;
        $('#result p').html(result); 
        eq += "="+result;
        $('#previous p').html(eq);
        eq = result;
        entry = result;
        curNumber = result;
        reset = true;
        inserirLinhaTabela(obj);
    });



    
  }

  const iniciar = () => {
    var eq = "";
    var curNumber="";
    var result = "";
    var entry = "";
    var reset = false;


    $("button").click(function() {    
      entry = $(this).attr("value");   
      
      if (entry === "ac") {
        entry=0;
        eq=0;
        result=0;
        curNumber=0;
        $('#result p').html(entry);
        $('#previous p').html(eq);  
      }
      
      else if (entry === "ce") {
        if (eq.length > 1) {
          eq = eq.slice(0, -1);        
          $('#previous p').html(eq);
        }
        else {
          eq = 0;  
          $('#result p').html(0);
        }
        
        $('#previous p').html(eq);
        
        if (curNumber.length > 1) {
          curNumber = curNumber.slice(0, -1);        
          $('#result p').html(curNumber);  
        }
        else {
          curNumber = 0;  
          $('#result p').html(0);
        }
        
      }
      
      else if (entry === "=") {

        calcular (eq);
        
      }
      
      else if (isNaN(entry)) {   //check if is not a number, and after that, prevents for multiple "." to enter the same number
        if (entry !== ".") {     
          reset = false;       
          if (curNumber === 0 || eq === 0) { 
            curNumber = 0;
            eq = entry;         
          }
          else {
            curNumber = "";
            eq += entry;
          }     
          $('#previous p').html(eq); 
        }
        else if (curNumber.indexOf(".") === -1) { 
          reset = false;
          if (curNumber === 0 || eq === 0) { 
            curNumber = 0.;
            eq = 0.;           
          }
          else {
            curNumber += entry;
            eq += entry;        
          }
          $('#result p').html(curNumber);
          $('#previous p').html(eq);        
        }      
      }
          
      else {  
        if (reset) {
          eq = entry;
          curNumber = entry;       
          reset = false;
        }
        else {
          eq += entry; 
          curNumber += entry;        
          }
        $('#previous p').html(eq); 
        $('#result p').html(curNumber);
        }   
      
      
      if (curNumber.length > 10 || eq.length > 26) {
        $("#result p").html("0");
        $("#previous p").html("Too many digits");
        curNumber ="";
        eq="";
        result ="";
        reset=true;
      }
      
      if (result.indexOf(".") !== -1) {
        result = result.truncate()
      }
      
    });
      
  }


  $(document).ready(function() {
    
    $("#btnConfirmar").click(() => {
      logar();
    });


  });