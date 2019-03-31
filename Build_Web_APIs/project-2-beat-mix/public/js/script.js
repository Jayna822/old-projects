// Drum Arrays
const ARRAY_LENGTH = 16;

const drums = {
    kicks: Array.apply(null, Array(ARRAY_LENGTH)).map(x => false),
    snares: Array.apply(null, Array(ARRAY_LENGTH)).map(x => false),
    hiHats: Array.apply(null, Array(ARRAY_LENGTH)).map(x => false),
    rideCymbals: Array.apply(null, Array(ARRAY_LENGTH)).map(x => false)
}

// let kicks = Array.apply(null, Array(16)).map(x => false);
// let snares = Array.apply(null, Array(16)).map(x => false);
// let hiHats = Array.apply(null, Array(16)).map(x => false);
// let rideCymbals = Array.apply(null, Array(16)).map(x => false);

function toggleDrum(drumPadType, index) {
    if (index < 0 || index > ARRAY_LENGTH-1) {
        return;
    }
    if (!Object.keys(drums).includes(drumPadType)) {
        return;
    }
    drums[drumPadType] = !(drums[drumPadType][index]);
}

function clear(drumPadType) {
    if (!Object.keys(drums).includes(drumPadType)) {
        return;
    }
    drums[drumPadType] = Array.apply(null, Array(ARRAY_LENGTH)).map(x => false);
}

function invert(drumPadType) {
    if (!Object.keys(drums).includes(drumPadType)) {
        return;
    }
    drums[drumPadType] = drums[drumPadType].map(x => !x);
}
