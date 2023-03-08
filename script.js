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
	if (textNodeIndex > 0) {
		title.style.opacity = '0';
		subtitle.style.opacity = '0';
	}
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
				showInv: false
			},
		]
	}, // 0
	{
		text: `Your eyes open, fog clouding them as you blink the dust away. You look around, admiring the distance to not send yourself in a panic.`,
		options: [
			{
				text: `Look Around`,
				next: 2,
				showInv: false
			}
		]
	}, // 1
	{
		text: 'In the distance, you notice a large castle surrounded by an ever-large city not too far away. It may be better to walk, but maybe someone could find you out here.',
		options: [
			{
				text: 'Walk to the City',
				next: 4,
				showInv: false
			},
			{
				text: 'Wait Patiently',
				next: 3,
				showInv: false
			},
		]
	}, // 2
	{
		text: `"Nah, bro" you exclaim, folding your arms and planting butt right back on the ground. Nothing happened, so you just...sat there.`,
		options: [
			{
				text: 'Walk to the City',
				next: 4,
				showInv: false
			},
			{
				text: 'Wait Patiently',
				next: 3,
				showInv: false
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
				next: 10,
				showInv: false
			},
			{
				text: `Oh, this'll be exciting!`,
				run: () => { extrovert += 1 },
				next: 9,
				showInv: false
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
				next: 14,
				showInv: false
			},
		]
	}, // 12
	{
		text: `"What do we have here?" The Blacksmith examines the blue jar hanging not discreetly in your pocket.`,
		options: [
			{
				text: `"Uh..."`,
				next: 17,
				showInv: false
			}
		]
	}, // 13
	{
		text: `"What are you doin' around these parks? You don't see the amount of danger this town poses?"`,
		options: [
			{
				text: `"Well..."`,
				status: [`9-1`],
				next: 15,
				showInv: false
			},
			{
				text: `"Actually..."`,
				status: [`9-2`],
				next: 16,
				showInv: false
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
				removeItem: ["Blue Goo"],
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
				text: `Apologize`,
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
		text: `You trek through the forest, the once sunny sky now turning amber from the Sunset.`,
		options: [
			{
				text: `Beautiful`,
				next: 49
			},
			{
				text: `"Screw That"`,
				next: 48
			},
		]
	}, // 47
	{
		text: `Suddenly, you collapse face first into the dirt. Looking what may have attacked you, you find a small (ominously glowing) book with the name "The Introvert Advantage" by Marti Olsen Laney.`,
		options: [
			{
				text: `Take the Book`,
				status: ['extrovert'],
				next: 49
			},
      {
				text: `Take the Book`,
				status: ['introvert'],
				next: 51
			},
      {
				text: `Leave the Book`,
				next: 50
			},
		]
	}, // 48
  {
    text: `You pick up the book, the sentences not grabbing you immediately, but you keep reading.`,
    options: [
      {
        text: `Keep Reading`,
        next: 62
      },
      {
        text: `Stop Reading`,
        next: 70
      },
    ]
  }, // 49
  {
    text: `You grumble at the inconvenient placement of the book and continue on your path through the forest.`,
    options: [
      {
        text: `"Stupid Book..."`,
        next: 52
      }
    ]
  }, // 50
  {
    text: `You pick up the book, the sentences you've read grabbing your attention immediately.`,
    options: [
      {
        text: `Keep Reading`,
        next: 53
      },
      {
        text: `Stop Reading`,
        next: 70
      }
    ]
  }, // 51
  {
    text: `Suddenly, you collapse face first into the dirt. Looking what may have attacked you, you find a small (ominously glowing) book with the name-- oh. It's the same book. It seemed to have moved.`,
    options: [
      {
				text: `Take the Book`,
				status: ['extrovert'],
				next: 49
			},
      {
				text: `Take the Book`,
				status: ['introvert'],
				next: 51
			},
      {
				text: `Leave the Book`,
				next: 50
			},
    ]
  }, // 52
  {
    text: `"Introversion is at its root a type of temperament. It is not the same as shyness or having a withdrawn personality, and it is not pathological." (Laney, 11)`,
    options: [
      {
        text: `Turn the Page`,
        next: 54
      },
      {
        text: `Stop Reading`,
        next: 70
      },
    ]
  }, // 53
  {
    text: `"[Introversion] is also not something you can change. But you can learn to work with it, not against it." (Laney, 11)`,
    options: [
      {
        text: `Turn the Page`,
        next: 55
      },
      {
        text: `Turn back a Page`,
        next: 53
      },
      {
        text: `Stop Reading`,
        next: 70
      },
    ]
  }, // 54
  {
    text: `"Introverts are like a rechargeable battery. They need to stop expending energy and rest in order to recharge. This is what a less stimulating environment provides for introverts. It restores energy." (Laney, 11)`,
    options: [
      {
        text: `Turn the Page`,
        next: 56
      },
      {
        text: `Turn back a Page`,
        next: 54
      },
      {
        text: `Stop Reading`,
        next: 70
      },
    ]
  }, // 55
  {
    text: `"Counter to our stereotypes of introverts, they are not necessarily quiet or withdrawn, but their focus is inside their heads. They need a quiet, reflective place where they can think things through and recharge themselves." (Laney, 13)`,
    options: [
      {
        text: `Turn the Page`,
        next: 57
      },
      {
        text: `Turn back a Page`,
        next: 55
      },
      {
        text: `Stop Reading`,
        next: 70
      },
    ]
  }, // 56
  {
    text: `"For introverts who have a high level of internal activity, anything coming from the outside raises their intensity level index quickly. It’s kind of like being tickled—the sensation goes from feeling good and fun to 'too much' and uncomfortable in a split second." (Laney, 13)`,
    options: [
      {
        text: `Turn the Page`,
        next: 58
      },
      {
        text: `Turn back a Page`,
        next: 56
      },
      {
        text: `Stop Reading`,
        next: 70
      },
    ]
  }, // 57
  {
    text: `"Introverts enjoy complexity when they can focus on one or two areas, without pressure. But if they have too many projects, they easily feel overwhelmed." (Laney, 14)`,
    options: [
      {
        text: `Turn the Page`,
        next: 59
      },
      {
        text: `Turn back a Page`,
        next: 57
      },
      {
        text: `Stop Reading`,
        next: 70
      },
    ]
  }, // 58
  {
    text: `"Introverts like depth and will limit their experiences but feel each of them deeply. Often, they have fewer friends but more intimacy." (Laney 15)`,
    options: [
      {
        text: `Turn the Page`,
        next: 60
      },
      {
        text: `Turn back a Page`,
        next: 58
      },
      {
        text: `Stop Reading`,
        next: 70
      },
    ]
  }, // 59
  {
    text: `"[Katie] Couric is peppy, spontaneous, and articulate. [Diane] Sawyer is restrained, lower-keyed, and more deliberate. Both are effective in their jobs." (Laney, 25)`,
    options: [
      {
        text: `Turn the Page`,
        next: 61
      },
      {
        text: `Turn back a Page`,
        next: 60
      },
      {
        text: `Stop Reading`,
        next: 70
      },
    ]
  }, // 60
  {
    text: `"If you don't pace yourself, you can end up feeling stressed and overwhelmed, unable to do anything. It gets worse if you procrastinate." (Laney, 223)`,
    options: [
      {
        text: `Read about Extroverts`,
        next: 62
      },
      {
        text: `Turn back a Page`,
        next: 60
      },
      {
        text: `Stop Reading`,
        next: 70
      },
    ]
  }, // 61
  {
    text: `"When extroversion is taken for granted as the natural outcome of healthy development, introversion can't help but become the "dreaded other." (Laney, 6)`,
    options: [
      {
        text: `Turn the Page`,
        next: 63
      },
      {
        text: `Stop Reading`,
        next: 70
      },
    ]
  }, // 62
  {
    text: `"Our culture values and rewards the qualities of extroverts. America was built on rugged individualism and the importance of citizens speaking their minds." (Laney, 5)`,
    options: [
      {
        text: `Turn the Page`,
        next: 64
      },
      {
        text: `Turn back a Page`,
        next: 62
      },
      {
        text: `Stop Reading`,
        next: 70
      },
    ]
  }, // 63
  {
    text: `"[Extroverts] are energized by the external world—by activities, people, places, and things. They are energy spenders." (Laney, 11)`,
    options: [
      {
        text: `Turn the Page`,
        next: 65
      },
      {
        text: `Turn back a Page`,
        next: 63
      },
      {
        text: `Stop Reading`,
        next: 70
      },
    ]
  }, // 64
  {
    text: `"By and large, extroverts like breadth—lots of friends and experiences, knowing a little bit about everything, being a generalist." (Laney, 14)`,
    options: [
      {
        text: `Turn the Page`,
        next: 66
      },
      {
        text: `Turn back a Page`,
        next: 64
      },
      {
        text: `Stop Reading`,
        next: 70
      },
    ]
  }, // 65
  {
    text: `"Consider the life of Prince William, of the Royal Family in Great Britain. He dislikes having a fuss made over him and having his picture taken, and he cares more about privacy than any other royal." (Laney, 27)`,
    options: [
      {
        text: `Turn the Page`,
        next: 67
      },
      {
        text: `Turn back a Page`,
        next: 65
      },
      {
        text: `Stop Reading`,
        next: 70
      },
    ]
  }, // 66
  {
    text: `"Extroverts like socializing and require the company of other people, but it’s as much about the need to be stimulated engage me, challenge me, give me something to react to —as it is to feel related." (Laney, 31)`,
    options: [
      {
        text: `Turn the Page`,
        next: 68
      },
      {
        text: `Turn back a Page`,
        next: 66
      },
      {
        text: `Stop Reading`,
        next: 70
      },
    ]
  }, // 67
  {
    text: `"Since extroverts get their energy from social sources and activities, they like being out on the town, flitting from flower to flower. They say, Just give me the stimulation jolt, and off I go." (Laney, 32)`,
    options: [
      {
        text: `Turn the Page`,
        next: 69
      },
      {
        text: `Turn back a Page`,
        next: 67
      },
      {
        text: `Stop Reading`,
        next: 70
      },
    ]
  }, // 68
  {
    text: `"Extroverts, being the majority, influence the entire cultural view of introversion. Extroverts’ verbal ease intimidates introverts, making it even easier for them to conclude that they shouldn’t speak." (Laney, 32)`,
    options: [
      {
        text: `Read about Introverts`,
        next: 53
      },
      {
        text: `Turn back a Page`,
        next: 68
      },
      {
        text: `Stop Reading`,
        next: 70
      },
    ]
  }, // 69
  {
    text: `You close the book and slip it in your pocket. Well, you attempted to. You just happen to just have baby pockets today.`,
    options: [
      {
        text: `"Stupid Pants..."`,
        addItem: ["TIA Book"],
        showInv: true,
        next: 71
      }
    ]
  }, // 70
  {
    text: `"Hey, there's my lost book from my library! I wonder how it got here. Where did you find it?" The King looks intriguingly at the book.`,
    options: [
      {
        text: `"I tripped over it."`,
        next: 72
      },
      {
        text: `"I've had it this whole time."`,
        removeItem: ["TIV Book"],
        showInv: true,
        next: 73
      }
    ]
  }, // 71
  {
    text: `"Oh. Well, what was it even doing out here? Meh, no matter, you can keep it. Consider it a thanks considering you seem interested in it." He chuckles.`,
    options: [
      {
        text: `"Thank you."`,
        next: 74
      }
    ]
  }, // 72
  {
    text: `"Meh, no matter. I've got to return this back to the library." He takes the book out of your hands (you just gave up trying to put it in your pocket) and chuckles.`,
    options: [
      {
        text: `"Oh."`,
        next: 74
      }
    ]
  }, // 73
  {
    text: `"Look ahead, there's a cave upon us!" You look ahead, noticing a cave upon you. "Too late to back out now," the king remarks.`,
    options: [
      {
        text: `Proceed (Too late to back out now)`,
        next: 75
      }
    ]
  }, // 74
  {
    text:`You go into the dark cave, just barely being able to see by the light from outside. You can feel the cold damp air around you. That is, till you hear commotion further in.`,
    options: [
      {
        text: `Investigate Commotion`,
        next: 76
      },
      {
        text: `Leave`,
        next: 78
      }
    ]
  }, // 75
  {
    text: `Running in, you find another monster, as well as a fighter trying to slay it. You could have sworn the monster wasn't that big in the castle but now isn't the time to question that.`,
    option: [
      {
        text: `Don't ask questions (there's no time to)`,
        status: ['extrovert'],
        next: 77
      },
      {
        text: `Don't ask questions (there's no time to)`,
        status: ['introvert'],
        next: 79
      },
    ]
  }, // 76
  {
    text: `The two seem to be in a battle, however the warrior is playing it a bit too safe. They repeatedly hide for cover and don't take a swing unless absolutely sure they'll hit.`,
    options: [
      {
        text: `"Uh oh!"`,
        next: 78
      }
    ]
  }, // 77
  {
    text: `The monster is easily overpowering them like this, if you don't help, they likely won't make it.`
  }, // 78
  {
    text: `The two seem to be in a battle, however the warrior is dominating the situation. Even with plenty of cover, not once do you see either of them even consider dodging a strike.`,
    options: [
      {
        text: `"They seem fine to me."`
      }
    ]
  }, // 79
  {
    text: `Well, actually, this amount of effort appears to be heavily taxing. If you don't help, they likely can't withstand themselves much longer.`
  } // 80
]

startGame()
