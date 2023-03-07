const textElement = document.getElementById('text')
const containerClass = document.getElementById('container')
const inventoryClass = document.getElementById('inventory')
const title = document.getElementById('title')
const subtitle = document.getElementById('subtitle')
const optionButtonsElement = document.getElementById('option-buttons')
const backButton = document.getElementById('history')

let inventory = []
let history = []
let extrovert = 0
let introvert = 0
let current = 0
let prev = [0];
let statuses = ["introvert"];

function startGame() {
	inventory = []
	history = []
	setTimeout(() => {
		containerClass.style.opacity = "1";
		containerClass.style.padding = "50px";
	}, 250)
	showTextNode(0)
}

function showTextNode(textNodeIndex) {
	statuses = statuses.filter((c, index) => {
		return statuses.indexOf(c) === index;
	});
	if (extrovert >= introvert) statuses[0] = "extrovert"
	else statuses[0] = 'introvert'
	const textNode = scripts[textNodeIndex]
	textElement.innerText = textNode.text
	while (optionButtonsElement.firstChild) {
		optionButtonsElement.removeChild(optionButtonsElement.firstChild)
	}

	/**
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
 */


	if (textNode.options) {
		textNode.options.forEach(option => {
			if (showOption(option)) {
				const button = document.createElement('button')
				button.innerText = option.text
				button.classList.add('btn')
				button.addEventListener('click', () => {
					//prev.push(option.next)
					current = option.next
					document.getElementById('myAudio').play();
					containerClass.style.opacity = "0";
					containerClass.style.padding = `100px`;
					inventoryClass.style.opacity = "0";
					setTimeout(() => {
						selectOption(option);
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
	} else {
		const button = document.createElement('button')
		button.innerText = `Next`
		button.classList.add('btn')
		button.addEventListener('click', () => {
			document.getElementById('myAudio').play();
			containerClass.style.opacity = "0";
			containerClass.style.padding = `100px`;
			inventoryClass.style.opacity = "0";
			setTimeout(() => {
				selectOption();
				inventoryClass.innerText = `Inventory: ${inventory.join(", ") || "Nothing"}`
				containerClass.style.opacity = "1"
				containerClass.style.padding = "50px";
			}, 500)
		})
		optionButtonsElement.appendChild(button)
		button.style.opacity = "0"
		setTimeout(() => { button.style.opacity = "1" }, Math.round(Math.random() * 250))
	}
}

function showOption(option) {
	console.log(statuses)
	if (option.required) {
		x = 0
		i = option.required.length
		option.required.forEach(item => {
			if (inventory.includes(item)) x++
		})
		if (x !== i) return false;
	}
	if (option.status) {
		y = 0
		z = option.status.length
		option.status.forEach(item => {
			if (statuses.includes(item)) y++
		})
		if (y !== z) return false;
	}
	return true;
}

function selectOption(option) {
	if (option) {
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
		showTextNode(nextNodeId ? nextNodeId : current + 1)
	} else {
		showTextNode(current + 1)
	}
	const button = document.createElement('div')
	button.innerText = `< Back`
	button.classList.add('history')
}

const scripts = [
	{
		text: '"Ugh...what happened...?"',
		options: [
			{
				text: 'Stand Up',
				next: 1,
			},
		]
	}, // 0
	{
		text: `Your eyes open, fog clouding them as you blink the dust away. You look around, admiring the distance to not send yourself in a panic.`,
		options: [
			{
				text: `Look Around`,
				next: 2
			}
		]
	}, // 1
	{
		text: 'In the distance, you notice a large castle surrounded by an ever-large city not too far away. It may be better to walk, but maybe someone could find you out here.',
		options: [
			{
				text: 'Walk to the City',
				next: 4,
			},
			{
				text: 'Wait Patiently',
				next: 3,
			},
		]
	}, // 2
	{
		text: `"Nah, bro" you exclaim, folding your arms and planting butt right back on the ground. Nothing happened, so you just...sat there.`,
		options: [
			{
				text: 'Walk to the City',
				next: 4,
			},
			{
				text: 'Wait Patiently',
				next: 3,
			},
		]
	}, // 3
	{
		text: `You finally decide to stand up and proceed towards the city, confused of everything that may have happened before.`
	}, // 4
	{
		text: `Almost towards the gates, you notice a glowing blue gooey substance in a jar on the ground. It looks very interesting.`,
		options: [
			{
				text: 'Pick up the Goo',
				addItem: ["Blue Goo"],
				showInv: true,
				next: 7,
			},
			{
				text: '"Ew, Goo."',
				next: 6,
			},
		]
	}, // 5
	{
		text: `You walk away from the Blue Goo, but a small part of you wondered what it could do.`,
		options: [
			{
				text: `"Gross."`,
				next: 8
			}
		]
	}, // 6
	{
		text: `You pick up the goo, it just pulsing in its glass prison.`
	}, // 7
	{
		text: `You venture on to the city, only viewing sights of broken buildings, few scared people, and fallen warriors.`,
		options: [
			{
				text: `That's terrifying...`,
				run: () => { introvert += 1 },
				next: 10
			},
			{
				text: `Oh, this'll be exciting!`,
				run: () => { extrovert += 1 },
				next: 9
			}
		]
	}, // 8
	{
		text: `With nothing else to do, you march happily across the dead bodies and stumble upon a blacksmith.`,
		options: [
			{
				text: `"Oh, goody!"`,
				run: () => { statuses.push(`9-1`) },
				next: 11
			}
		]
	}, // 9
	{
		text: `With fear and anxiety, you tip-toe quietly and with a broken heart across the dead bodies and stumble upon a blacksmith.`,
		options: [
			{
				text: `"Oh no..."`,
				run: () => { statuses.push(`9-2`) },
				next: 12
			}
		]
	}, // 10
	{
		text: `"A- an adventurer!" the blacksmith exclaims, obviously fearful of his own life.`,
		options: [
			{
				text: `Hide behind the Jar of Blue Goo`,
				required: ["Blue Goo"],
				next: 13
			},
			{
				text: `"What uuuuuuuup?"`,
				next: 14
			},
		]
	}, // 11
	{
		text: `"Heya, pal!" The blacksmith says with just a little too much glee.`,
		options: [
			{
				text: `Hide behind the Jar of Blue Goo`,
				required: ["Blue Goo"],
				next: 13
			},
			{
				text: `"Hello...sir...?"`,
				next: 14
			},
		]
	}, // 12
	{
		text: `"What do we have here?" The Blacksmith examines the blue jar hanging not discreetly in your pocket.`,
		options: [
			{
				text: `"Uh..."`,
				next: 17
			}
		]
	}, // 13
	{
		text: `"What are you doin' around these parks? You don't see the amount of danger this town poses?"`,
		options: [
			{
				text: `"Well..."`,
				status: [`9-1`],
				next: 15
			},
			{
				text: `"Actually..."`,
				status: [`9-2`],
				next: 16
			},
		]
	}, // 14
	{
		text: `You do not.`,
		options: [
			{
				text: `Right...`,
				next: 21,
			}
		]
	}, // 15
	{
		text: `It's obvious that you do.`,
		options: [
			{
				text: `"Logically."`,
				next: 21
			}
		]
	}, // 16
	{
		text: `"Y'know, I could give you a mighty fine weapon for that... if you're willing to trade that is." He gestures to the Sword and Shield sitting at a Table.`,
		options: [
			{
				text: `Buy the Sword`,
				required: [`Blue Goo`],
				removeItem: [`Blue Goo`],
				addItem: [`Sword`],
				next: 18
			},
			{
				text: `Buy the Shield`,
				required: [`Blue Goo`],
				removeItem: [`Blue Goo`],
				addItem: [`Shield`],
				next: 20
			},
			{
				text: `Refuse`,
				next: 19
			},
		]
	}, // 17
	{
		text: `"The sword, simple and light. Great Choice!" He passes it over. "If you know how to use it..." he mutters. "Anyways,"`,
		options: [
			{
				text: `"...?"`,
				next: 14
			},
		]
	}, // 18
	{
		text: `"Neither tickle ya fancy, huh?" He looks at you suspiciously and leaves the items on the table. "Well, regardless..."`,
		options: [
			{
				text: `"...?"`,
				next: 14
			},
		]
	}, // 19
	{
		text: `"The shield. Strong, metallic, and entirely made of wood." He passes it over. "It's not a fake." He winks. "Anyways..."`,
		options: [
			{
				text: `"Metallic...?"`,
				next: 14
			},
		]
	}, // 20
	{
		text: `"Since you're 'ere, there's a buncha these hunks-a-junks jumping around killin' everythin'. One even landed in the castle. Scrap 'em out, will ya?`,
		options: [
			{
				text: `"Absolutely."`,
				next: 24
			},
			{
				text: `"Absolutely not."`,
				next: 22
			},
		]
	}, // 21
	{
		text: `"Nah, bro" you exclaim, folding your arms and walking straight back into the forest.`,
		options: [
			{
				text: `"It sounds like a them problem."`,
				next: 23
			}
		]
	}, // 22
	{
		text: `After staying in the forest a while, you realize literally anything could be better than dealing with the wildlife, and so return. You meet the blacksmith again and he shouts "Welcome back! Took ya long enough."`,
		options: [
			{
				text: `Sigh`,
				next: 21
			}
		]
	}, // 23
	{
		text: `Without being much for small talk, you wave goodbye to the blacksmith and proceed to the castle.`,
		options: [
			{
				text: `"Yipee!"`,
				run: () => {
					if (!statuses.includes('24-1') && !statuses.includes('24-2')) {
						extrovert += 1
						statuses.push(`24-1`)
					}
				},
				next: 25
			},
			{
				text: `"Aw man..."`,
				run: () => {
					if (!statuses.includes('24-1') && !statuses.includes('24-2')) {
						introvert += 1
						statuses.push(`24-1`)
					}
				},
				next: 26
			}
		]
	}, // 24
	{
		text: `Delighted, you strut forth through the dangerous castle. You note only small things, such as a few holes in the walls, and entire floor being removed, and very loud roar in the other room.`,
		options: [
			{
				text: `Investigate the Walls`,
				next: 27
			},
			{
				text: `Investigate the Missing Floor`,
				next: 28
			},
			{
				text: `Investigate the Loud Roar`,
				next: 29
			},
			{
				text: `Run`,
				next: 30
			},
		]
	}, // 25
	{
		text: `Fearful, you quietly sneak around the terrifying castle. Holes are punched in the walls, an ENTIRE FLOOR has been removed, and a loud thundering roar bursts through the walls!`,
		options: [
			{
				text: `Investigate the Walls`,
				next: 27
			},
			{
				text: `Investigate the Missing Floor`,
				next: 28
			},
			{
				text: `Investigate the Loud Roar`,
				next: 29
			},
			{
				text: `Run`,
				next: 30
			},
		]
	}, // 26
	{
		text: `The walls are tall yet entirely torn. It looks as if someone named Matthew was playing Fortnite with how many holes there are in the walls.`,
		options: [
			{
				text: `Investigate the Missing Floor`,
				next: 28
			},
			{
				text: `Investigate the Loud Roar`,
				next: 29
			},
			{
				text: `Run`,
				next: 30
			},
		]
	}, // 27
	{
		text: `The 2nd floor of the building is just...missing. As if a moving company just began renovating the home, the whole thing is nowhere to be found, save some rubble.`,
		options: [
			{
				text: `Investigate the Walls`,
				next: 27
			},
			{
				text: `Investigate the Loud Roar`,
				next: 29
			},
			{
				text: `Run`,
				next: 30
			},
		]
	}, // 28
	{
		text: `The loud roar appears to have come from the main corridors. You walk forth and come eye to eye with a giant, hairy, disgusting troll (the fantasy kind).`,
		options: [
			{
				text: `Fight`,
				next: 31
			},
			{
				text: `Run`,
				next: 30
			},
		]
	}, // 29
	{
		text: `"Nah, bro" you exclaim, planting feet firmly on the ground and backing right up on out of there into the forest. You bolt past the merchant who shouts "HEY," and stumble back into the forest.`,
		options: [
			{
				text: `"Not a me problem."`,
				next: 23
			}
		]
	}, // 30
	{
		text: `The monster stands before you. What do you do?!`,
		options: [
			{
				text: `Swing your Sword`,
				required: [`Sword`],
				next: 32
			},
			{
				text: `Throw Blue Goo`,
				required: [`Blue Goo`],
				next: 34
			},
			{
				text: `Block the Next Attack`,
				required: [`Shield`],
				next: 37
			},
			{
				text: `Intimidate It`,
				next: 33
			},
			{
				text: `Run`,
				next: 30
			},
		]
	}, // 31
	{
		text: `You swing your average human sword fiercely at it and it just breaks on impact! I forgot to mention how absolutely buff it is. It swings back, and absolutely atomizes you.`,
		options: [
			{
				text: `Respawn`,
				next: 31
			}
		]
	}, // 32
	{
		text: `You stand your ground, puffing your chest out, and stare that enemy down.`,
		options: [
			{
				text: `Scold the Tall Being`,
				next: 35
			}
		]
	}, // 33
	{
		text: `You throw the blue goo at the fiend, smashing the glass right in its face and then BOOM!`,
		options: [
			{
				text: `Brace For Impact`,
				next: 36
			}
		]
	}, // 34
	{
		text: `The tall being looks frightened, it taking steps backgrounds. With you looking proud of yourself, you scold the troll with ferocity.`,
		options: [
			{
				text: `Be Proud of Yourself`,
				run: () => { extrovert += 1 },
				next: 38
			},
			{
				taxt: `Apologize`,
				run: () => { introvert += 1 },
				next: 38
			}
		]
	}, // 35
	{
		text: `Ash falls as the monster seems to have disappeared in a flash of light. Neither trace of the goo or the monster can be seen.`,
		options: [
			{
				text: `"Huh?"`,
				next: 39
			}
		]
	}, // 36
	{
		text: `It lifts its heavy arm and swings fiercely at you as you put a really small wooden circle in front of you. Do I need to say more?`,
		options: [
			{
				text: `Respawn`,
				next: 31
			}
		]
	}, // 37
	{
		text: `Unsurprisingly though, it wasn't afraid of you. It simply had a heart attack and died.`,
		options: [
			{
				text: `"...oh"`,
				next: 39
			}
		]
	}, // 38
	{
		text: `As you blink rapidly and ponder what in the world has just happened, you notice a quivering royal figure in the corner, him blinking just as fast as you are.`,
		options: [
			{
				text: `Blink Faster`,
				next: 40
			}
		]
	}, // 39
	{
		text: `"Wh- what in the world?!" the king says, obviously in panic.`,
		options: [
			{
				text: `"Uh..."`,
				next: 41
			}
		]
	}, // 40
	{
		text: `"Y-You... you killed it! You saved us! Thank goodness you've saved us, our Hero!" The king shoots up and congratulates you, shaking your hand furiously`,
		options: [
			{
				text: `Shake his Hand`,
				next: 42
			},
		]
	}, // 41
	{
		text: `"Dear Warrior, please! You must find the other monsters that have Ravaged our Town and slaughter them! I'll reward you Handsomely for it!"`,
		options: [
			{
				text: `"YES. ABSOLUTELY. YES."`,
				run: () => { extrovert += 1 },
				next: 43
			},
			{
				text: `Nod Slowly`,
				run: () => { introvert += 1 },
				next: 44
			},
			{
				text: `"Nah, Bro."`,
				run: () => { introvert += 1 },
				next: 45
			},
		]
	}, // 42
	{
		text: `"Thank goodness! Just go out through the Forest till you reach a Cave, they should be there!" He gestures in the direction of the forest, the same you woke up in`,
		options: [
			{
				text: `Proceed`,
				next: 47
			},
			{
				text: `"Nah, Bro."`,
				next: 45
			},
		]
	}, // 43
	{
		text: `You just silently accept and start heading out, before the king can continue, not wanting to deal with any more after the monster.`,
		options: [
			{
				text: `Proceed`,
				next: 47
			}
		]
	}, // 44
	{
		text: `"Nah, bro.", you say, folding your arms and shake your head at the king.`,
		options: [
			{
				text: `"That sounds like a you problem."`,
				next: 46
			}
		]
	}, // 45
	{
		text: `"Please?" asks the King.`,
		options: [
			{
				text: `"Fine."`,
				next: 47
			},
			{
				text: `I said no.`,
				next: 46
			},
		]
	}, // 46
	{
		text: `You trek through the forest, the once sunny sky now turning amber from the Sunset. And after a while of walking, you find a cave, with a dead campfire outside.`,
		options: [
			{
				text: `Enter`,
				next: 49
			},
			{
				text: `"Screw That"`,
				next: 48
			},
		]
	}, // 47
	{
		text: `You instantly say "Screw that!" and walk in a complete new direction, away from both the kingdom and the cave... and you get lost, so you retrace your steps.`,
		options: [
			{
				text: `>:/`,
				next: 47
			}
		]
	}, // 48
	{
		text: `You go into the dark cave, just barely being able to see by the light from outside. You can feel the cold damp air around you. That is, till you hear commotion further in.`,
		options: [
			{
				text: `Investigate`,
				next: 50
			},
			{
				text: `"Screw That"`,
				next: 48
			},
		]
	}, // 49
	{
		text: `Running in, you find another monster, as well as a fighter trying to slay it. You could have sworn the monster wasn't that big in the castle but now isn't the time to question that.`,
		options: [
			{
				text: `"How Joyful!"`,
				status: ['extrovert'],
				next: 51
			},
			{
				text: `"Uh oh..."`,
				status: ['introvert'],
				next: 52
			},
		]
	}, // 50
	{
		text: `The two seem to be in a battle, however the warrior is playing it a bit too safe. They repeatedly hide for cover and don't take a swing unless absolutely sure they'll hit.`,
		options: [
			{
				text: `I see`,
				next: 53
			}
		]
	}, // 51
	{
		text: `The two seem to be in a battle, however the warrior is dominating the situation. Even with plenty of cover, not once do you see either of them even consider dodging a strike.`,
		options: [
			{
				text: `"Dangerous."`,
				next: 53
			}
		]
	}, // 52
	{
		text: `The monster is easily overpowering them like this, if you don't help, they likely won't make it.`,
		options: [
			{
				text: `Help Them`,
				next: 55
			},
			{
				text: `"Screw that, they got it."`,
				next: 48
			}
		]
	}, // 53
	{
		text: `This amount of effort appears to be heavily taxing. If you don't help, they likely can't withstand themselves much longer.`,
		options: [
			{
				text: `Help Them`,
				next: 56
			},
			{
				text: `"Screw that, they got it."`,
				next: 48
			}
		]
	}, // 54
]

startGame()
