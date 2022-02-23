//criando o objeto apartir dos atributos recebidos by id
class Despesa {
	constructor(ano, mes, dia, tipo, descricao, valor) {
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}

	//validacao dos dados, pra ver se tem algo preenchido errado (deve estar antes da gravacao, e dentro do objeto despesa)
	//o for recupera atributos ou chaves de array ou objeto e coloca numa variavel. o this faz recuperar todos os elementos do objeto
	//this[i] recupera cada atributo do objeto
	//e da um return true pra caso nao haja nenhum desses "erros"

	validarDados() {
		for(let i in this) {
			if(this[i] == undefined || this[i] == '' || this[i] == null) {
				return false
			}
		}
		return true
	}
}

//class para fazer a interação com o banco de dados no local storage
class Bd {

	constructor() {
		let id = localStorage.getItem('id')

		if(id === null) {
			localStorage.setItem('id', 0)
		} //atribui valor 0 ao id
	}

	getProximoId() {
		let proximoId = localStorage.getItem('id') //recuperar dado dentro de local storage
		return parseInt(proximoId) + 1
	} //retorna o dado e poe +1

	gravar(d) {
		let id = this.getProximoId()

		//mandar os dados da despesa pro local storage
		localStorage.setItem(id, JSON.stringify(d)) //identifica o item, o proprio item

		localStorage.setItem('id', id)
	}

	recuperarTodosRegistros() {

		//array de despesas
		let despesas = Array()

		let id = localStorage.getItem('id')

		//recuperar todas as despesas cadastradas em localStorage
		//define como 1, a cada interaçao ve se é menor ou igual a 1, e adiciona +1 a cada interação para passar para o seguinte
		for(let i = 1; i <= id; i++) {

			//recuperar a despesa, transformando a stringy em atributos do objeto
			let despesa = JSON.parse(localStorage.getItem(i))

			//existe a possibilidade de haver índices que foram pulados/removidos
			//nestes casos nós vamos pular esses índices
			if(despesa === null) {
				continue
			}

			//cada despesa ter um id
			despesa.id = i
			//recupero o array despesas, executa push, passando despesa. para adicionar a cada interação
			despesas.push(despesa)
		}

		return despesas
	}

	//criar metodo pesquisar para receber uma despesa
	pesquisar(despesa){

		let despesasFiltradas = Array()
		despesasFiltradas = this.recuperarTodosRegistros()
		console.log(despesasFiltradas);
		console.log(despesa)

		//se o ano recuperado da dispesa for diferente de vazio, aplica o filtro
		//pega o valor contido no determinado indice, =>(retorna true ou false),pra ver vai ser igual ao objeto do filtro
		//ano
		if(despesa.ano != ''){
			console.log("filtro de ano");
			despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
		}
			
		//mes
		if(despesa.mes != ''){
			console.log("filtro de mes");
			despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
		}

		//dia
		if(despesa.dia != ''){
			console.log("filtro de dia");
			despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
		}

		//tipo
		if(despesa.tipo != ''){
			console.log("filtro de tipo");
			despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
		}

		//descricao
		if(despesa.descricao != ''){
			console.log("filtro de descricao");
			despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
		}

		//valor
		if(despesa.valor != ''){
			console.log("filtro de valor");
			despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
		}

		
		return despesasFiltradas
	}

	//remover um elemento do localstorage
	remover(id) {
		localStorage.removeItem(id)
	}
}

let bd = new Bd()


function cadastrarDespesa() {

	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')

	let despesa = new Despesa(
		ano.value, 
		mes.value, 
		dia.value, 
		tipo.value, 
		descricao.value,
		valor.value
	)

	//validacao dos dados, pra ver se tem algo preenchido errado 
	//(deve estar antes da gravacao, e dentro do objeto despesa)
	if(despesa.validarDados()) {
		bd.gravar(despesa)

		document.getElementById('modal_titulo').innerHTML = 'Registro inserido com sucesso'
		document.getElementById('modal_titulo_div').className = 'modal-header text-success'
		document.getElementById('modal_conteudo').innerHTML = 'Despesa foi cadastrada com sucesso!'
		document.getElementById('modal_btn').innerHTML = 'Voltar'
		document.getElementById('modal_btn').className = 'btn btn-success'

		//dialog de sucesso
		$('#modalRegistraDespesa').modal('show') 

		//limpar os campos apos ser gravado com sucesso
		ano.value = ''
		mes.value = ''
		dia.value = ''
		tipo.value = ''
		descricao.value = ''
		valor.value = ''		

	} else {
		
		document.getElementById('modal_titulo').innerHTML = 'Erro na inclusão do registro'
		document.getElementById('modal_titulo_div').className = 'modal-header text-danger'
		document.getElementById('modal_conteudo').innerHTML = 'Erro na gravação, verifique se todos os campos foram preenchidos corretamente!'
		document.getElementById('modal_btn').innerHTML = 'Voltar e corrigir'
		document.getElementById('modal_btn').className = 'btn btn-danger'

		//dialog de erro
		$('#modalRegistraDespesa').modal('show') 
	}
}

function carregaListaDespesas(despesas = Array(), filtro = false) {

    if(despesas.length == 0 && filtro == false){
		despesas = bd.recuperarTodosRegistros() 
	}

	//selecionando o TBODY da tabela
	let listaDespesas = document.getElementById("listaDespesas")
	listaDespesas.innerHTML = ''

	//percorrer o array despesas, listando cada despesa de forma dinamica
	despesas.forEach(function(d) {

		//Criando a linha (tr)
		let linha = listaDespesas.insertRow();

		//Criando as colunas (td)
		linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}` 

		//Ajustar o tipo
		switch(d.tipo){
			case '1': d.tipo = 'Alimentação'
				break
			case '2': d.tipo = 'Educação'
				break
			case '3': d.tipo = 'Lazer'
				break
			case '4': d.tipo = 'Saúde'
				break
			case '5': d.tipo = 'Transporte'
				break
			
		}
		linha.insertCell(1).innerHTML = d.tipo
		linha.insertCell(2).innerHTML = d.descricao
		linha.insertCell(3).innerHTML = d.valor

		//criar o botao de exclusao
		let btn = document.createElement("button")
		btn.className = 'btn btn-danger'
		btn.innerHTML = '<i class="fas fa-times"></i>'
		btn.id = 'id_despesa_' + d.id
		btn.onclick = function(){
			//remover a despesa
			//remover a string da frente, troca por vazio
			let id = this.id.replace('id_despesa_', '')

			//alert(id)
			
			bd.remover(id) //ele ta recuperando la no Bd pra remover
			
			//atualizar a pagina apos remover
			window.location.reload()
		}
		linha.insertCell(4).append(btn) //coloca o botao na linha4

		console.log(d)
	})

 }

//criar uma funcao para filtrar as despesas na hora de procurar pelo consulta
  function pesquisarDespesa(){
	 
	let ano  = document.getElementById("ano").value
	let mes = document.getElementById("mes").value
	let dia = document.getElementById("dia").value
	let tipo = document.getElementById("tipo").value
	let descricao = document.getElementById("descricao").value
	let valor = document.getElementById("valor").value

	let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

	let despesas = bd.pesquisar(despesa)
	 
	this.carregaListaDespesas(despesas, true)

 }
