/*
    based on the website: https://spicyyoghurt.com/tutorials/html5-javascript-game-development/images-and-sprite-animations
    to simulate physic exercise
*/
class Game
{
    constructor(canvas_id)
    {
        this.canvas = document.getElementById(canvas_id);
        this.context = this.canvas.getContext('2d');
        this.game_objs = [];
        this.previous_time_stamp = 0;
        this.speed = 60;
        this.restitution = 0.6;
    }

    set_canvas()
    {
        // keep 16:10
        this.canvas.width = window.innerWidth * 0.8;
        this.canvas.height = window.innerWidth * 0.5;
    }

    create_world()
    {
        for (let i=0; i<20; i++)
        {
            let x = pseudoRandomNoGenerator(0, this.canvas.width);
            let y = pseudoRandomNoGenerator(0, this.canvas.height);
            let vx = pseudoRandomNoGenerator(-50, 50);
            let vy = pseudoRandomNoGenerator(-50, 50);
            let mass = pseudoRandomNoGenerator(10, 40);
            this.game_objs.push(new Potion(this.context, x, y, vx, vy, mass));
        } 
    }

    run(time_stamp)
    {
        let elapsed = (time_stamp - this.previous_time_stamp)/1000;
        elapsed = Math.min(elapsed, 0.1);
        this.previous_time_stamp = time_stamp;

        this.game_objs.forEach((obj) => {
            obj.update(elapsed);
        });
        this.detect_edge_collision();
        this.detect_collision();
        this.clear_canvas();
        this.game_objs.forEach((obj) => {
            obj.draw();
        });
        window.requestAnimationFrame((time_stamp) => this.run(time_stamp));
    }

    clear_canvas()
    {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    detect_collision()
    {
        let obj1;
        let obj2;
        this.game_objs.forEach((obj) => { obj.is_collided = false });

        for (let i=0; i<this.game_objs.length; i++)
        {
            obj1 = this.game_objs[i];

            for (let j=i+1; j<this.game_objs.length; j++)
            {
                obj2 = this.game_objs[j];
                if (this.circle_intersect(obj1.x, obj1.y, obj1.radius, obj2.x, obj2.y, obj2.radius))
                {
                    obj1.is_collided = true;
                    obj2.is_collided = true;
                    obj1.handle_collision();
                    obj2.handle_collision();
                    let v_collision = { x: obj2.x-obj1.x, y: obj2.y-obj1.y };
                    let distance = Math.sqrt((obj1.x - obj2.x) * (obj1.x - obj2.x) 
                                             + (obj1.y - obj2.y) * (obj1.y - obj2.y));
                    let v_collision_normal = {
                        x: v_collision.x / distance, 
                        y: v_collision.y / distance
                    };
                    let v_relative_velocity = { x: obj1.vx - obj2.vx, y: obj1.vy - obj2.vy };
                    let speed = v_relative_velocity.x * v_collision_normal.x
                        + v_relative_velocity.y * v_collision_normal.y;
                    speed *= Math.min(obj1.restitution, obj2.restitution);
                    if (speed < 0)
                        break;
                    let impulse = 2 * speed / (obj1.mass + obj2.mass);
                    obj1.vx -= (impulse * obj2.mass * v_collision_normal.x);
                    obj1.vy -= (impulse * obj2.mass * v_collision_normal.y);
                    obj2.vx += (impulse * obj1.mass * v_collision_normal.x);
                    obj2.vy += (impulse * obj1.mass * v_collision_normal.y);
                }
            }
        }
    }

    detect_edge_collision()
    {
        this.game_objs.forEach((obj)=> {
            if (obj.x < obj.radius)
            {
                obj.vx = Math.abs(obj.vx) * this.restitution;
                obj.x = obj.radius;
                obj.handle_collision();
            }
            else if (obj.x > this.canvas.width - obj.radius)
            {
                obj.vx = -Math.abs(obj.vx) * this.restitution;
                obj.x = this.canvas.width - obj.radius;
                obj.handle_collision();
            }
            if (obj.y < obj.radius)
            {
                obj.vy = Math.abs(obj.vy) * this.restitution;
                obj.y = obj.radius;
                obj.handle_collision();
            }
            else if ( obj.y > this.canvas.height - obj.radius)
            {
                obj.vy = -Math.abs(obj.vy) * this.restitution;
                obj.y = this.canvas.height - obj.radius;
                obj.handle_collision();
            }
        });
    }

    circle_intersect(x1, y1, r1, x2, y2, r2)
    {
        let distance = (x1-x2)*(x1-x2) + (y1-y2)*(y1-y2);
        return distance <= ((r1+r2)*(r1+r2));
    }
}