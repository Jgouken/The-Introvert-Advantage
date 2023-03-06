const textElement = document.getElementById('text')
const containerClass = document.getElementById('container')
const inventoryClass = document.getElementById('inventory')
const title = document.getElementById('title')
const subtitle = document.getElementById('subtitle')
const optionButtonsElement = document.getElementById('option-buttons')
const backButton = document.getElementById('history')

let inventory = []
let history = []
let stamina = 100
let prev = [0];
x = 0

async function startGame() {
	inventory = []
	history = []
	setTimeout(() => {
		containerClass.style.opacity = "1";
		containerClass.style.padding = "50px";
	}, 250)
	showTextNode(0)
}

async function showTextNode(textNodeIndex) {
	let x = 0
	console.log(prev)
	console.log(prev.length > 1)
	const textNode = scripts[textNodeIndex]
	textElement.innerText = textNode.text
	while (optionButtonsElement.firstChild) {
		optionButtonsElement.removeChild(optionButtonsElement.firstChild)
	}

	if (textNode.noBack) backButton.style.left = '-50%'
	else if (prev.length > 1) backButton.style.left = '-7%'

	backButton.addEventListener("click", () => {
		document.getElementById('myAudio').play();
		containerClass.style.opacity = "0";
		containerClass.style.padding = `100px`;
		inventoryClass.style.opacity = "0";
		setTimeout(() => {
			inventoryClass.innerText = `Inventory: ${inventory.join(", ") || "Nothing"}`
			containerClass.style.opacity = "1"
			containerClass.style.padding = "50px";
			prev.pop()
			showTextNode(prev[prev.length - 1]);
		}, 500)
	});

	textNode.options.forEach(option => {
		if (showOption(option)) {
			const button = document.createElement('button')
			button.innerText = option.text
			button.classList.add('btn')
			button.addEventListener('click', async () => {
				prev.push(option.next)
				await document.getElementById('myAudio').play();
				containerClass.style.opacity = "0";
				containerClass.style.padding = `100px`;
				inventoryClass.style.opacity = "0";
				setTimeout(async() => {
					await selectOption(option);
					inventoryClass.innerText = `Inventory: ${inventory.join(", ") || "Nothing"}`
					containerClass.style.opacity = "1"
					containerClass.style.padding = "50px";
				}, 500)
			})
			optionButtonsElement.appendChild(button)
			button.style.opacity = "0"
			setTimeout(() => { button.style.opacity = "1" }, Math.round(Math.random() * 250))
		}
	})
}

async function showOption(option) {
	if (option.required) {
		x = 0
		i = option.required.length
		option.required.forEach(item => {
			if (inventory.includes(item)) x++
		})

		if (x === i) return true;
		else return false;
	}
	else return true;
}

async function selectOption(option) {
	const nextNodeId = option.next
	if (nextNodeId <= 0) {
		return startGame()
	}

	if (option.addItem) {
		option.addItem.forEach((item) => {
			inventory.push(item)
		})
	}

	if (option.removeItem) {
		option.removeItem.forEach((item) => {
			inventory.splice(inventory.indexOf(item), 1)
		})
	}

	if (option.showInv !== false) inventoryClass.style.opacity = "1";

	if (option.run) option.run()
	showTextNode(nextNodeId)
	const button = document.createElement('div')
	button.innerText = `< Back`
	button.classList.add('history')
}

const scripts = [
	{
		text: 'You wake up in a strange place and you see a jar of blue goo near you.',
		options: [
			{
				text: 'Take the goo',
				addItem: ["Blue Goo"],
				next: 1,
				run: function() {

				}
			},
			{
				text: 'Leave the goo',
				next: 1
			}
		]
	},
	{
		text: 'You venture forth in search of answers to where you are when you come across a merchant.',
		options: [
			{
				text: 'Trade the goo for a sword',
				required: ["Blue Goo"],
				addItem: ["Sword"],
				removeItem: ["Blue Goo"],
				next: 2
			},
			{
				text: 'Trade the goo for a shield',
				required: ["Blue Goo"],
				addItem: ["Shield"],
				removeItem: ["Blue Goo"],
				next: 2
			},
			{
				text: 'Ignore the merchant',
				next: 2
			}
		]
	},
	{
		text: 'After leaving the merchant you start to feel tired and stumble upon a small town next to a dangerous looking castle.',
		options: [
			{
				text: 'Explore the castle',
				next: 3,
				showInv: false
			},
			{
				text: 'Find a room to sleep at in the town',
				next: 4,
				showInv: false
			},
			{
				text: 'Find some hay in a stable to sleep in',
				next: 5
			}
		]
	},
	{
		text: 'You are so tired that you fall asleep while exploring the castle and are killed by some terrible monster in your sleep.',
		options: [
			{
				text: 'Restart',
				next: -1
			}
		]
	},
	{
		text: 'Without any money to buy a room you break into the nearest inn and fall asleep. After a few hours of sleep the owner of the inn finds you and has the town guard lock you in a cell.',
		options: [
			{
				text: 'Restart',
				next: -1
			}
		]
	},
	{
		text: 'You wake up well rested and full of energy ready to explore the nearby castle.',
		options: [
			{
				text: 'Explore the castle',
				next: 6
			}
		]
	},
	{
		text: 'While exploring the castle you come across a horrible monster in your path.',
		options: [
			{
				text: 'Try to run',
				next: 7,
				showInv: false
			},
			{
				text: 'Attack it with your sword',
				required: ["Sword"],
				removeItem: ["Sword"],
				next: 8,
				showInv: false
			},
			{
				text: 'Hide behind your shield',
				required: ["Shield"],
				removeItem: ["Shield"],
				next: 9,
				showInv: false
			},
			{
				text: 'Throw the blue goo at it',
				required: ["Blue Goo"],
				removeItem: ["Blue Goo"],
				next: 10,
				showInv: false
			}
		]
	},
	{
		text: 'Your attempts to run are in vain and the monster easily catches.',
		options: [
			{
				text: 'Restart',
				next: -1
			}
		]
	},
	{
		text: 'You foolishly thought this monster could be slain with a single sword.',
		options: [
			{
				text: 'Restart',
				next: -1
			}
		]
	},
	{
		text: 'The monster laughed as you hid behind your shield and ate you.',
		options: [
			{
				text: 'Restart',
				next: -1
			}
		]
	},
	{
		text: 'You threw your jar of goo at the monster and it exploded. After the dust settled you saw the monster was destroyed. Seeing your victory you decide to claim this castle as your and live out the rest of your days there.',
		options: [
			{
				text: 'Congratulations. Play Again.',
				next: -1
			}
		]
	}
]

startGame()
