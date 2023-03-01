const textElement = document.getElementById('text')
const containerClass = document.getElementById('container')
const inventoryClass = document.getElementById('inventory')
const optionButtonsElement = document.getElementById('option-buttons')
const blob = document.getElementById('blob')

window.onpointermove = event => {
	const { clientX, clientY } = event;

	blob.animate({
		left: `${clientX}px`,
		top: `${clientY}px`
	}, { duration: 3000, fill: "forwards" });
}

let inventory = []

function startGame() {
	inventory = []
	showTextNode(1)
}

function showTextNode(textNodeIndex) {
	const textNode = textNodes.find(textNode => textNode.id === textNodeIndex)
	textElement.innerText = textNode.text
	while (optionButtonsElement.firstChild) {
		optionButtonsElement.removeChild(optionButtonsElement.firstChild)
	}

	textNode.options.forEach(async option => {
		if (showOption(option)) {
			const button = document.createElement('button')
			button.innerText = option.text
			button.classList.add('btn')
			button.addEventListener('click', async () => {
				containerClass.style.opacity = "0";
				inventoryClass.style.opacity = "0";
				setTimeout(() => {
					selectOption(option);
					inventoryClass.innerText = `Inventory: ${inventory.join(", ") || "Nothing"}`
					containerClass.style.opacity = "1"
				}, 500)
			})
			optionButtonsElement.appendChild(button)
		}
	})
}

function showOption(option) {
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

function selectOption(option) {
	const nextTextNodeId = option.nextText
	if (nextTextNodeId <= 0) {
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
	showTextNode(nextTextNodeId)
}

const textNodes = [
	{
		id: 1,
		text: 'You wake up in a strange place and you see a jar of blue goo near you.',
		options: [
			{
				text: 'Take the goo',
				addItem: ["Blue Goo"],
				nextText: 2
			},
			{
				text: 'Leave the goo',
				nextText: 2
			}
		]
	},
	{
		id: 2,
		text: 'You venture forth in search of answers to where you are when you come across a merchant.',
		options: [
			{
				text: 'Trade the goo for a sword',
				required: ["Blue Goo"],
				addItem: ["Sword"],
				removeItem: ["Blue Goo"],
				nextText: 3
			},
			{
				text: 'Trade the goo for a shield',
				required: ["Blue Goo"],
				addItem: ["Shield"],
				removeItem: ["Blue Goo"],
				nextText: 3
			},
			{
				text: 'Ignore the merchant',
				nextText: 3
			}
		]
	},
	{
		id: 3,
		text: 'After leaving the merchant you start to feel tired and stumble upon a small town next to a dangerous looking castle.',
		options: [
			{
				text: 'Explore the castle',
				nextText: 4,
				showInv: false
			},
			{
				text: 'Find a room to sleep at in the town',
				nextText: 5,
				showInv: false
			},
			{
				text: 'Find some hay in a stable to sleep in',
				nextText: 6
			}
		]
	},
	{
		id: 4,
		text: 'You are so tired that you fall asleep while exploring the castle and are killed by some terrible monster in your sleep.',
		options: [
			{
				text: 'Restart',
				nextText: -1
			}
		]
	},
	{
		id: 5,
		text: 'Without any money to buy a room you break into the nearest inn and fall asleep. After a few hours of sleep the owner of the inn finds you and has the town guard lock you in a cell.',
		options: [
			{
				text: 'Restart',
				nextText: -1
			}
		]
	},
	{
		id: 6,
		text: 'You wake up well rested and full of energy ready to explore the nearby castle.',
		options: [
			{
				text: 'Explore the castle',
				nextText: 7
			}
		]
	},
	{
		id: 7,
		text: 'While exploring the castle you come across a horrible monster in your path.',
		options: [
			{
				text: 'Try to run',
				nextText: 8,
				showInv: false
			},
			{
				text: 'Attack it with your sword',
				required: ["Sword"],
				removeItem: ["Sword"],
				nextText: 9,
				showInv: false
			},
			{
				text: 'Hide behind your shield',
				required: ["Shield"],
				removeItem: ["Shield"],
				nextText: 10,
				showInv: false
			},
			{
				text: 'Throw the blue goo at it',
				required: ["Blue Goo"],
				removeItem: ["Blue Goo"],
				nextText: 11,
				showInv: false
			}
		]
	},
	{
		id: 8,
		text: 'Your attempts to run are in vain and the monster easily catches.',
		options: [
			{
				text: 'Restart',
				nextText: -1
			}
		]
	},
	{
		id: 9,
		text: 'You foolishly thought this monster could be slain with a single sword.',
		options: [
			{
				text: 'Restart',
				nextText: -1
			}
		]
	},
	{
		id: 10,
		text: 'The monster laughed as you hid behind your shield and ate you.',
		options: [
			{
				text: 'Restart',
				nextText: -1
			}
		]
	},
	{
		id: 11,
		text: 'You threw your jar of goo at the monster and it exploded. After the dust settled you saw the monster was destroyed. Seeing your victory you decide to claim this castle as your and live out the rest of your days there.',
		options: [
			{
				text: 'Congratulations. Play Again.',
				nextText: -1
			}
		]
	}
]

startGame()