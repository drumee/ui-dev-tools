const argparse = require("argparse");

const parser = new argparse.ArgumentParser({
	description: "Drumee widget initializer",
	addHelp: true,
});


parser.addArgument("--fig", {
	type: String,
	default: '',
	help: "figGroup.figName",
});
parser.addArgument("--dest", {
	type: String,
	default: '',
	help: "Destination dir. Must be empty",
});

parser.addArgument("--parent", {
	type: String,
	default: '',
	help: "Drumee Core Object. e.g LetcBox",
});

const args = parser.parseArgs();
module.exports = args;
