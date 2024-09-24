import { sucClr, wrnClr, errClr, defClr, graClr, whiClr } from "./chalks.js"

// Menu terminal
export function menuUI () {
    console.log(
        "\n   Menu\n  ¯¯¯¯¯¯\n"+
        "[1] Presets\n"+
        "[2] Manual\n"+
        "[3] LiveInput\n"+
        "[4] Help\n"+
        "[5] Exit"
    );
}

export function presetUI () {
    console.log(
        "\n   Presets\n  ¯¯¯¯¯¯¯¯¯\n"+
        "[1] Available\n"+
        "[2] Away\n"+
        "[3] Meeting\n"+
        "[4] Lunch\n"+
        "[5] Closed\n"+
        "[6] Default\n"+
        "[7] Back"
    );
}

export function manualUI () {
    console.log(
        "\n   Manual\n  ¯¯¯¯¯¯¯¯\n"+
        "[1] Text\n"+
        "[2] Text size\n"+
        "[3] Background color\n"+
        "[4] Background image\n"+
        "[5] Back"
    );
}

export function helpUI () {
    console.log(
        "\n\n    " + wrnClr("Navigate"), "using the numbers displayed on screen.\n"+
        "    " + sucClr("Presets"), "option allows the client to add prechosen messages.\n"+
        "    " + sucClr("Manual"), "input allows the client to edit existing elements manually.\n"+
        "    " + sucClr("LiveInput"), "allows the client to edit text on the fly (mildly unstable).\n"+
        "    " + sucClr("Help"), "- That's it. You're here.\n"+
        "    " + sucClr("Exit"), "says what it does."
    )
}