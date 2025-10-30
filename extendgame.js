import readline from "readline";

 
function createPlayer(name = "Unnamed Hero") {
  return { name, inventory: [], currentRoom: "Research Lab", isAlive: true };
}

 
function createRoom(name, description, items = [], exits = {}, puzzle = null) {
  return { name, description, items, exits, puzzle };
}

 
function showDetails(room) {
  console.log(`\n📍 ${room.name}`);
  console.log(room.description);
  console.log(room.items.length ? `Items here: ${room.items.join(", ")}` : "Nothing interesting here.");
  const exits = Object.keys(room.exits);
  console.log(exits.length ? `Exits: ${exits.join(", ")}` : "No visible exits.");
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

 
function pickUp(player, rooms, item) {
  const room = rooms[player.currentRoom];
  if (!item) return console.log("Pick what exactly? Air doesn’t count.");

  if (room.items.includes(item)) {
    player.inventory.push(item);
    room.items = room.items.filter((i) => i !== item);
    console.log(`You picked up the ${item}.`);
  } else console.log(`No ${item} found here.`);
}

function move(player, rooms, direction) {
  const next = rooms[player.currentRoom].exits[direction];
  if (next) {
    player.currentRoom = next;
    console.log(`You move ${direction} into ${next}.`);
    showDetails(rooms[player.currentRoom]);
  } else console.log("You bump into a wall. Maybe try another direction?");
}

function showInventory(player) {
  console.log(player.inventory.length ? `Inventory: ${player.inventory.join(", ")}` : "You have nothing yet.");
}

 
function combineItems(player, item1, item2) {
  if (!player.inventory.includes(item1) || !player.inventory.includes(item2)) {
    console.log("You don’t have both items to combine.");
    return;
  }

  if (item1 === "flashlight" && item2 === "battery") {
    console.log("You combined the flashlight and battery to make a working flashlight!");
    player.inventory = player.inventory.filter((i) => i !== item1 && i !== item2);
    player.inventory.push("working flashlight");
  } else {
    console.log("Those items refuse to cooperate. Try a different combo.");
  }
}

 
function useItem(player, rooms, item) {
  if (!player.inventory.includes(item)) {
    console.log("You don’t have that item.");
    return;
  }

  const room = rooms[player.currentRoom];
  if (item === "working flashlight" && room.name === "Dark Cave") {
    console.log("You use the flashlight and reveal a note with a code: '314'");
    room.puzzle = { question: "Enter the code to unlock the next door:", answer: "314", solved: false };
  } else {
    console.log("You wave the item around... nothing happens.");
  }
}

 
function setupGame() {
  const rooms = {
    "Research Lab": createRoom(
      "Research Lab",
      "You wake up surrounded by beakers and notes. A flashlight lies on the table.",
      ["flashlight"],
      { east: "Storage Room" }
    ),
    "Storage Room": createRoom(
      "Storage Room",
      "Boxes everywhere. You spot a battery under some cables.",
      ["battery"],
      { west: "Research Lab", north: "Dark Cave" }
    ),
    "Dark Cave": createRoom(
      "Dark Cave",
      "Pitch black. You can’t see a thing. Maybe you need light?",
      [],
      { south: "Storage Room", east: "Control Room" }
    ),
    "Control Room": createRoom(
      "Control Room",
      "A console blinks red — locked by a passcode.",
      [],
      { west: "Dark Cave", north: "Exit Gate" },
      { question: "Enter the 3-digit code:", answer: "314", solved: false }
    ),
    "Exit Gate": createRoom(
      "Exit Gate",
      "A massive gate stands ahead. A certificate glows in the corner.",
      ["certificate"],
      { south: "Control Room" }
    ),
  };
  const player = createPlayer();
  return { player, rooms };
}

 
function handlePuzzle(player, rooms, rl, loop) {
  const room = rooms[player.currentRoom];
  const answer = interact(room);
  if (!answer) return loop();

  rl.question(">> ", (res) => {
    if (res.toLowerCase() === answer.toLowerCase()) {
      console.log("✅ The puzzle unlocks something important!");
      room.puzzle.solved = true;
    } else console.log("❌ Wrong answer. Try again or explore elsewhere.");
    loop();
  });
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
    case "combine":
      combineItems(player, args[0], args[1]);
      return loop();
    case "use":
      useItem(player, rooms, arg);
      return loop();
    case "look":
      showDetails(rooms[player.currentRoom]);
      return loop();
    case "interact":
      return handlePuzzle(player, rooms, rl, loop);
    case "quit":
      console.log("You decide to abandon your quest. KN-Lang world sighs.");
      rl.close();
      break;
    default:
      console.log("That command makes no sense here.");
      loop();
  }
}
 
function startGame() {
  const { player, rooms } = setupGame();
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  console.log("✨ Welcome to KN-Lang Puzzle Quest ✨");
  console.log("Commands: go, pick, combine, use, inventory, look, interact, quit");
  showDetails(rooms[player.currentRoom]);

  function loop() {
    rl.question("\n>> ", (cmd) => {
      handleCommand(cmd.trim().toLowerCase(), player, rooms, rl, loop);

      // win condition
      if (player.inventory.includes("certificate")) {
        console.log("🏆 You picked up the certificate and escaped KN-Lang Labs! Well done!");
        rl.close();
      }
    });
  }
  loop();
}

 
startGame();