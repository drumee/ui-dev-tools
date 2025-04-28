const argparse = require("argparse");

const parser = new argparse.ArgumentParser({
	description: "Drumee Development Tools ",
	add_help: true,
});

parser.add_argument("--from", {
	type: String,
	help: "Source dir to scann seeds from",
});

parser.add_argument("--verbose", {
	type: "int",
	help: "Show more message.",
});

parser.add_argument("--libs", {
	type: String,
	help: "Comma separated list folders to define as roots of seeds files",
	help: "Tide gauge id (default Brest).",
});


const args = parser.parse_args();
Object.freeze(args)
module.exports = args;