/* 
    based on https://spicyyoghurt.com/tutorials/html5-javascript-game-development/images-and-sprite-animations 
*/

let canvas = document.getElementById('game_canvas');
let context;
let img;
window.onload = function()
{
    init();
}
window.onresize = function() 
{
    init();
}

main();

function main()
{
    img = new Image();
    img.src = 'sprite_animation.png';
    img.onload = draw_potion;
}
function draw_potion()
{
    context = canvas.getContext('2d');
    const frame_width = 50;
    const frame_height = 61;
    let col = 1;
    let row = 0;
    context.drawImage(img, col*frame_width, row*frame_height, frame_width, frame_height,
                            10, 10, frame_width, frame_height);
}
function set_canvas(ratio)
{
    canvas.width = window.innerWidth * ratio;
    canvas.height = window.innerHeight * ratio;
}
function init()
{
    set_canvas(0.8);
    draw_potion();
}