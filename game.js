import readline from "readline";

 
function createPlayer(name = "Unnamed Hero") {
  return { name, inventory: [], currentRoom: "Entrance", isAlive: true };
}

function pickUp(player, rooms, item) {
  const room = rooms[player.currentRoom];
  if (!item) return console.log("Pick up what? Air? Try harder.");

  if (room.items.includes(item)) {
    player.inventory.push(item);
    room.items = room.items.filter((i) => i !== item);
    console.log(`You picked up the ${item}. Confidence level +10.`);

     
    if (item.toLowerCase() === "trophy") {
      console.log(" Congratulations! You’ve escaped KN-Lang Labs victorious!");
      player.isAlive = false;
      process.exit(0);
    }
  } else console.log(`There’s no ${item} here. Maybe it evaporated?`);
}

function move(player, rooms, direction) {
  const next = rooms[player.currentRoom].exits[direction];
  if (next) {
    player.currentRoom = next;
    console.log(`You move ${direction} into ${next}.`);
    showDetails(rooms[player.currentRoom]);
  } else console.log("You walk into a wall. The wall seems unimpressed.");
}

function showInventory(player) {
  if (player.inventory.length === 0)
    console.log("Your pockets are emptier than your soul after debugging.");
  else console.log("Inventory:", player.inventory.join(", "));
}

 
function createRoom(name, description, items = [], exits = {}, puzzle = null) {
  return { name, description, items, exits, puzzle };
}

function showDetails(room) {
  console.log(`\n📍 ${room.name}`);
  console.log(room.description);
  console.log(
    room.items.length
      ? `Items here: ${room.items.join(", ")}`
      : "It's empty... suspiciously empty."
  );
  const exits = Object.keys(room.exits);
  console.log(exits.length ? `Exits: ${exits.join(", ")}` : "No visible exits. Uh oh.");
}

function interact(room) {
  if (room.puzzle && !room.puzzle.solved) {
    console.log(room.puzzle.question);
    return room.puzzle.answer;
  } else {
    console.log("There’s nothing to interact with here.");
    return null;
  }
}

 
function setupGame() {
  const rooms = {
    Entrance: createRoom(
      "Entrance",
      "You stand before a flickering neon sign that reads 'KN-Lang Labs'. The door behind you locks. Welp.",
      ["flashlight" ],
      { north: "Spooky Dungeon" }
    ),
    "Spooky Dungeon": createRoom(
      "Spooky Dungeon",
      "Damp walls, moldy smell, and a distant snore echoing... There’s a locked door to the west.",
      ["rusty key"],
      { south: "Entrance", west: "Locked Door" }
    ),
    
    "Locked Door": createRoom(
      "Locked Door",
      "A large metal door blocks your way. There’s a keyhole staring at you judgmentally.",
      [],
      { east: "Spooky Dungeon", north: "Treasure Chamber" },
      { question: "Use a key to unlock the door? (yes/no)", answer: "yes", solved: false }
    ),
    "Treasure Chamber": createRoom(
      "Treasure Chamber",
      "Golden lights fill the room. You see a shiny trophy that says 'KNNX Winner!'.",
      ["trophy"],
      { south: "Locked Door" }
    ),
  };
  const player = createPlayer();
  return { player, rooms };
}

function startGame() {
  const { player, rooms } = setupGame();
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log("✨ Welcome to the Mysterious Land of KN-Lang! ✨");
  console.log("Commands: go <dir>, pick <item>, inventory, look, interact, quit.");
  showDetails(rooms[player.currentRoom]);

  function loop() {
    rl.question("\n>> ", (cmd) => {
      handleCommand(cmd.trim().toLowerCase(), player, rooms, rl, loop);
    });
  }
  loop();
}

function handleCommand(command, player, rooms, rl, loop) {
  const [action, ...args] = command.split(" ");
  const arg = args.join(" ");  

  switch (action) {
    case "go":
      move(player, rooms, arg);
      return loop();
    case "pick":
      pickUp(player, rooms, arg);
      return loop();
    case "inventory":
      showInventory(player);
      return loop();
    case "look":
      showDetails(rooms[player.currentRoom]);
      return loop();
    case "interact":
      return handlePuzzle(player, rooms, rl, loop);
    case "quit":
      console.log("You close the terminal, but the KN-Lang world misses you.");
      rl.close();
      break;
    default:
      console.log("The game stares blankly. That command made zero sense.");
      loop();
  }
}

function handlePuzzle(player, rooms, rl, loop) {
  const room = rooms[player.currentRoom];
  const answer = interact(room);
  if (!answer) return loop();

  rl.question(">> ", (res) => {
    if (res.toLowerCase() === answer && player.inventory.includes("rusty key")) {
      console.log("Click! The door unlocks with a heroic sound!");
      room.puzzle.solved = true;
    } else console.log("The door refuses your attempt. Maybe you need a key?");
    loop();
  });
}

 
startGame();

