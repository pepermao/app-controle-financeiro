class Despesas {
	constructor(ano, mes, dia, tipo, descricao, valor) {
		this.ano = ano
		this.mes = mes
		this.dia = dia
		this.tipo = tipo
		this.descricao = descricao
		this.valor = valor
	}

	validarDados() {
		for(let i in this) {
			if(this[i] == undefined || this[i] == '' || this[i] == null) {
				return false
			}
		}
		return true
	}
}

class Bd {
	constructor() {
		let id = localStorage.getItem('id')

		if(id === null) {
			localStorage.setItem('id', 0)
		}
	}

	getProximoId() {
		let proximoId = localStorage.getItem('id')
		return parseInt(proximoId) + 1
	}

	gravar(d) {
		let id = this.getProximoId()

		localStorage.setItem(id, JSON.stringify(d))
		localStorage.setItem('id', id)
	}

	recuperarTodosRegistros() {
		let despesas = []

		let id = localStorage.getItem('id')

		for(let i = 1; i <= id; i++) {
			// passar de JSON para objeto literal
			let despesa = JSON.parse(localStorage.getItem(i))
			

			if (despesa === null) {
				continue
			}

			despesa.id = i

			despesas.push(despesa)
		}
		return despesas
	}

	pesquisar(despesa) {
		let despesasFiltradas = []
		despesasFiltradas = this.recuperarTodosRegistros()

		//ano
		if(despesa.ano != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
		}
		//mes
		if(despesa.mes != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
		}
		//dia
		if(despesa.dia != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
		}
		//tipo
		if(despesa.tipo != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
		}
		//descrição
		if(despesa.descricao != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
		}
		//valor
		if(despesa.valor != '') {
			despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
		}

		return despesasFiltradas
	}

	remover(id) {
		localStorage.removeItem(id)
	}
}

let bd = new Bd()

const recoverInputExpense = () => {
	let ano = document.getElementById('ano')
	let mes = document.getElementById('mes')
	let dia = document.getElementById('dia')
	let tipo = document.getElementById('tipo')
	let descricao = document.getElementById('descricao')
	let valor = document.getElementById('valor')
}

const limparCampos = () => {
	ano.value = ''
	mes.value = ''
	dia.value = ''
	tipo.value = ''
	descricao.value = ''
	valor.value = ''
}

const showSucessModal = () => {
	document.getElementById('modal_titulo').className = 'modal-title text-success'
	document.getElementById('modal_titulo').append("Registro inserido com sucesso")
	document.getElementById('modal-texto').append("Despesa registrada com sucesso")
	document.getElementById('modal_botao').className = 'btn btn-success'
	document.getElementById('modal_botao').append('Voltar')

	$('#modalRegistraDespesa').modal('show')
}

const showErrorModal = () => {
	document.getElementById('modal_titulo').className = 'modal-title text-danger'
	document.getElementById('modal_titulo').append("Erro na gravação")
	document.getElementById('modal-texto').append("Existem campos obrigatórios que não foram preenchidos")
	document.getElementById('modal_botao').className = 'btn btn-danger'
	document.getElementById('modal_botao').append('Voltar e corrigir')

	$('#modalRegistraDespesa').modal('show')
}

const showDeleteModal = () => {
	document.querySelector('#modal_titulo').className = 'text-danger'
	document.querySelector('#modal_titulo').append('Despesa excluída')
	document.querySelector('#modal-texto').append(`A despesa foi excluída com sucesso`)
	document.querySelector('#modal_botao').addEventListener('click', reloadPage)
	document.querySelector('#modal_botao').append('Voltar')
	document.querySelector('#modal_botao').className = 'btn btn-danger'

	$('#modalRegistraDespesa').modal('show')
}

const cadastrarDespesa = () => {
	recoverInputExpense()

	let despesa = new Despesas(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)


	if(despesa.validarDados() == true) {
		bd.gravar(despesa)

		showSucessModal()
		limparCampos()

	} else {
		showErrorModal()
	}
}

const checkExpenseType = d => {
	switch(parseInt(d.tipo)) {
		case 1: d.tipo = 'Alimentação'
			break
		case 2: d.tipo = 'Educação'
			break
		case 3: d.tipo = 'Lazer'
			break
		case 4: d.tipo = 'Saúde'
			break
		case 5: d.tipo = 'Transporte'
			break
	}
}

const createColumnsTable = (d, linha) => {
	linha.insertCell(0).append(`${d.dia}/${d.mes}/${d.ano}`)
	linha.insertCell(1).append(d.tipo)
	linha.insertCell(2).append(d.descricao)
	linha.insertCell(3).append(d.valor)
}

const createDeleteButton = (d, linha) => {
	let btn = document.createElement("button")
	btn.className = 'btn btn-danger'
	btn.innerHTML = '<i class="fas fa-times"></i>'
	btn.id = `id_despesa_${d.id}`
	btn.onclick = function() { //
		let id = this.id.replace('id_despesa_', '')

		bd.remover(id)
		//modal a despesa foi excluída com sucesso
		showDeleteModal()
	} 
	linha.insertCell(4).append(btn)
}

const carregaListaDespesas = (despesas = [], filtro = false) => {
	if(despesas.length == 0 && filtro == false) {
		despesas = bd.recuperarTodosRegistros()
	}

	let listaDespesas = document.getElementById('listaDespesas')

	listaDespesas.innerHTML = ''

	despesas.forEach(function(d) {
		checkExpenseType(d)
		//criando linhas
		let linha = listaDespesas.insertRow()
		//criar colunas
		createColumnsTable(d, linha)
		//criar botão de exclusão
		createDeleteButton(d, linha)
	})
}

const reloadPage = () => {
	window.location.reload()
}

const pesquisarDespesa = () => {
	recoverInputExpense()

	let despesa = new Despesas(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)
	let despesas = bd.pesquisar(despesa)

	carregaListaDespesas(despesas, true)

	console.log(despesas)
}

const despesasFiltradas = []

const createDownButton = (i, buttonDown, tableRowMonth, buttonUp) => {
	iconDown = document.createElement('i')
	iconDown.className = 'fas fa-angle-down'
	buttonDown.append(iconDown)
	buttonDown.className = 'btn btn-primary'
	buttonDown.setAttribute("data-month", despesasFiltradas[i])

	buttonDown.addEventListener('click', function() {
		const mes = this.getAttribute('data-month')

		exibirRelatorioDespesas(mes, buttonDown, buttonUp)
	})

	tableRowMonth.insertCell(1).append(buttonDown)
}

const createUpButton = (i, buttonDown, tableRowMonth, buttonUp) => {
	iconUp = document.createElement('i') //cria icone de seta pra cima
	iconUp.className = 'fas fa-angle-up' //altera classe do icone do fontawesone
	buttonUp.append(iconUp) //adiciona o icone ao botão
	buttonUp.className = 'btn btn-primary' //altera a classe do botão para classe do bootstrap
	buttonUp.setAttribute("data-month-disable", despesasFiltradas[i]) //adiciona um atributo com o respectivo mês
	buttonUp.setAttribute('hidden', 'true') //esconde o botão

	//adiciona um evento de clique no botão que faz as despesas do respectivo mês ficarem escondidas
	buttonUp.addEventListener('click', function() {
		const mes = this.getAttribute('data-month-disable') //recupera o tbody do mes respectivo

		document.querySelector(`.tbodyMonth${mes}`).remove() //remove as despesas

		buttonUp.hidden = true //esconde o botãoUp
		buttonDown.hidden = false //revela o botãoDown
	})

	tableRowMonth.insertCell(2).append(buttonUp) //insere o botão na coluna 2 da linha da tabela
}

const createDataFrequencyTable = () => {
	//cria tabela de relatorios de cada mes
	for (var i = 0; i <= despesasFiltradas.length - 1; i++) {
		const tableData = document.querySelector('#table-data')
		const tbodyMonth = document.createElement('tbody')
		
		//cria tbody
		tableData.append(tbodyMonth)
		tbodyMonth.id = despesasFiltradas[i]
		
		//cria linha
		const tableRowMonth = document.createElement('tr')
		tableRowMonth.id = `${despesasFiltradas[i]}_Row`
		tbodyMonth.append(tableRowMonth)
		
		//cria colunas
		tableRowMonth.insertCell(0).append(despesasFiltradas[i])
		
		const buttonDown = document.createElement('button')
		const buttonUp = document.createElement('button')
		//cria botãoDown que faz aparecer as depesas respectivas de cada mês
		createDownButton(i, buttonDown, tableRowMonth, buttonUp)
		//cria o botaoUp que faz desaparecer as despesas respectivas de cada mês
		createUpButton(i, buttonDown, tableRowMonth, buttonUp)
	}
}

const verifyMonth = d => {
	despesas.forEach(function(d) {
		switch (Number(d.mes)) {
			case 1: 
				d.mes = 'Janeiro'
				if (despesasFiltradas.indexOf(d.mes) === -1) {
					despesasFiltradas.push(d.mes)
				}
				break
			case 2: 
				d.mes = 'Fevereiro'
				if (despesasFiltradas.indexOf(d.mes) === -1) {
					despesasFiltradas.push(d.mes)
				}
				break
			case 3: 
				d.mes = 'Março'
				if (despesasFiltradas.indexOf(d.mes) === -1) {
					despesasFiltradas.push(d.mes)
				}
				break
			case 4: 
				d.mes = 'Abril'
				if (despesasFiltradas.indexOf(d.mes) === -1) {
					despesasFiltradas.push(d.mes)
				}
				break
			case 5: 
				d.mes = 'Maio'
				if (despesasFiltradas.indexOf(d.mes) === -1) {
					despesasFiltradas.push(d.mes)
				}
				break
			case 6: 
				d.mes = 'Junho'
				if (despesasFiltradas.indexOf(d.mes) === -1) {
					despesasFiltradas.push(d.mes)
				}
				break
			case 7: 
				d.mes = 'Julho'
				if (despesasFiltradas.indexOf(d.mes) === -1) {
					despesasFiltradas.push(d.mes)
				}
				break
			case 8: 
				d.mes = 'Agosto'
				if (despesasFiltradas.indexOf(d.mes) === -1) {
					despesasFiltradas.push(d.mes)
				}
				break
			case 9: 
				d.mes = 'Setembro'
				if (despesasFiltradas.indexOf(d.mes) === -1) {
					despesasFiltradas.push(d.mes)
				}
				break
			case 10: 
				d.mes = 'Outubro'
				if (despesasFiltradas.indexOf(d.mes) === -1) {
					despesasFiltradas.push(d.mes)
				}
				break
			case 11: 
				d.mes = 'Novembro'
				if (despesasFiltradas.indexOf(d.mes) === -1) {
					despesasFiltradas.push(d.mes)
				}
				break
			case 12: 
				d.mes = 'Dezembro'
				if (despesasFiltradas.indexOf(d.mes) === -1) {
					despesasFiltradas.push(d.mes)
				}
				break
		}
	})
}

//indicadores agrupar a soma das depesas por tipo e mês
const loadExpenseDataMonths = () => {
	despesas = bd.recuperarTodosRegistros()

	verifyMonth(despesas)
	createDataFrequencyTable()
}

const createTableRow = tbodyExpenses => {
	//cria linha
	theadRowExpensesMonth = document.createElement('tr')
	tbodyExpenses.append(theadRowExpensesMonth)
}

const createHeadColumn = (theadRowExpensesMonth) => {
	//cria head column
	theadRowExpensesMonth.insertCell(0).append('Data')
	theadRowExpensesMonth.insertCell(1).append('Tipo')
	theadRowExpensesMonth.insertCell(2).append('Descrição')
	theadRowExpensesMonth.insertCell(3).append('Valor')
}

const exibirRelatorioDespesas = (mes, buttonDown, buttonUp) => {
	const month = document.querySelector(`#${mes}`)

	//cria tbody dentro da tbody respectiva do seu mês
	const tbodyExpenses = document.createElement('tbody')
	tbodyExpenses.className = `tbodyMonth${mes}`
	month.append(tbodyExpenses)
	
	createTableRow(tbodyExpenses)

	createHeadColumn(theadRowExpensesMonth)
	
	//fazer verificao do mes e imprimir quantos necessario
	despesas = bd.recuperarTodosRegistros()
	verifyMonth(despesas)

	const verificaMesEFrequencia = []

	verificaMesEFrequencia.push(despesas
		.filter((despesa) =>  despesa.mes
		.includes(month.id)))

	addExpensesIntoData(verificaMesEFrequencia, tbodyExpenses)

	buttonDown.hidden = true
	buttonUp.hidden = false
}

const addExpensesIntoData = (monthAndFrequence, tbodyExpenses) => {

	for(let i = 0; i <= monthAndFrequence[0].length - 1; i++) {

		checkExpenseType(monthAndFrequence[0][i])
		returnMonthInNumber(monthAndFrequence[0][i])

		tbodyRowExpensesMonth = document.createElement('tr')
		tbodyExpenses.append(tbodyRowExpensesMonth)

		tbodyRowExpensesMonth.insertCell(0).append(`${monthAndFrequence[0][i].dia}/${monthAndFrequence[0][i].mes}/${monthAndFrequence[0][i].ano}`)
		tbodyRowExpensesMonth.insertCell(1).append(monthAndFrequence[0][i].tipo)
		tbodyRowExpensesMonth.insertCell(2).append(monthAndFrequence[0][i].descricao)
		tbodyRowExpensesMonth.insertCell(3).append(monthAndFrequence[0][i].valor)
	}
}

const returnMonthInNumber = m => {
	switch (m.mes) {
		case 'Janeiro': 
			m.mes = 1
			return m.mes
		case 'Fevereiro': 
			m.mes = 2
			return m.mes
		case 'Março': 
			m.mes = 3
			return m.mes
		case 'Abril': 
			m.mes = 4
			return m.mes
		case 'Maio': 
			m.mes = 5
			return m.mes
		case 'Junho': 
			m.mes = 6
			return m.mes
		case 'Julho': 
			m.mes = 7
			return m.mes
		case 'Agosto': 
			m.mes = 8
			return m.mes
		case 'Setembro': 
			m.mes = 9
			return m.mes
		case 'Outubro': 
			m.mes = 10
			return m.mes
		case 'Novembro': 
			m.mes = 11
			return m.mes
		case 'Dezembro': 
			m.mes = 12
			return m.mes
	}
}