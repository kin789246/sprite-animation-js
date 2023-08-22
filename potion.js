class Potion extends GameObject
{
    static num_rows = 2;
    static num_cols = 5;
    static frame_width = 0;
    static frame_height = 0;
    static image;

    constructor(ctx, x, y, vx, vy, mass)
    {
        super(ctx, x, y, vx, vy, mass);
        this.radius = mass;
        this.current_frame = 0;
        this.restitution = pseudoRandomNoGenerator(1,10)/10;
        if (!Potion.image)
        {
            Potion.image = new Image();
            Potion.image.src = "sprite_animation.png";
            Potion.image.onload = () => {
                Potion.frame_width = Potion.image.width / Potion.num_cols;
                Potion.frame_height = Potion.image.height / Potion.num_rows;
            }
        }
    }

    update(elapsed)
    {
        // add gravity = 9.81
        this.vy += 9.81*elapsed;
        
        this.x += this.vx*elapsed;
        this.y += this.vy*elapsed;
        
        // calculate the angle
        let radians = Math.atan2(this.vy, this.vx);
        this.angle = radians * 180 / Math.PI;
    }

    draw()
    {
        let max_frame = Potion.num_cols * Potion.num_rows - 1;
        if (this.current_frame > max_frame)
        {
            this.current_frame = 0;
        }
        let column = this.current_frame % Potion.num_cols;
        let row = Math.floor(this.current_frame / Potion.num_cols);
        let ix = this.x - this.radius;
        let iy = this.y - this.radius*1.21;
        // rotate image
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate(Math.PI / 180 * (this.angle + 90));
        this.ctx.translate(-this.x, -this.y);
        this.ctx.drawImage(Potion.image, 
            column * Potion.frame_width, row * Potion.frame_height,
            Potion.frame_width, Potion.frame_height,
            ix, iy, 
            this.radius*2, this.radius*2.42);
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        // draw hitbox
        // this.ctx.beginPath();
        // this.ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI);
        // this.ctx.stroke();
        // this.ctx.beginPath();
        // this.ctx.rect(ix, iy, this.radius*2, this.radius*2.42);
        // this.ctx.stroke();
    }

    handle_collision()
    {
        this.current_frame++;
    }
}