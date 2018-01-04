# Breakout
[PLAY](https://01omartorres.github.io/Breakout)

An implementation of the classic Breakout game released in 1976 and created by Steve Wozniak.

![BreakoutGif](https://raw.githubusercontent.com/01omartorres/Breakout/master/images/breakout_video.gif)

# Controls

A Key - Move angle pointer left.
D Key - Move angle pointer right.
UP ARROW KEY - Release ball.
LEFT ARROW KEY - Move paddle left.
RIGHT ARROW KEY - Move paddle right.

# Technologies

* Javascript
* HTML 
* CSS
* P5.js

# Features / Goals 

My implementation of Breakout includes all the familiar features from the classic game. Players control a paddle at the bottom of the screen that is used to prevent the ball from hitting the floor. The objective remains to be to break all the bricks/blocks at the top of the screen with the ball. 

However, unlike the classic game I chose to take on the challenge of implementing power ups as well as a target pointer to allow the player to control where to direct the ball at the start of the game. 

# Challenges

Two of the main (and related) challenges I encountered while building this game were creating the target pointer to allow the player to choose where to initially direct the ball, and reflecting the ball at different angles depending on where on the paddle the ball lands. Suffice it to say that I had to revisit high school trigonometry. 

![sketch](https://raw.githubusercontent.com/01omartorres/Breakout/master/images/sketch_idea.jpg)

By far the most difficult part of building this game, however, was figuring out how to detect collision between the ball and the paddle. It's not as simple as it sounds. What I did was I created an invisible line with one end point on the paddle and the other on the center of the ball at all times. Thus, the line's endpoints would consistently change depending on where the ball was at any point in time. I then calculated if the distance between the two endpoint was less than or equal to the radius of the ball. If this case returned true, then I knew that the ball and the paddle were colliding. 


```javascript
const Util = {
  ballCollideWithPaddle: function(ball, point_x, point_y){
    let distance_between_points = dist(ball.x, ball.y, point_x, point_y)
    if(dist(ball.x+ball.change_x, ball.y+ball.change_y, point_x, point_y) <= ball.radius){
      return true
    }
  }
}
```




# Implementations & Timeline

* Day 1: Learn P5.js library; how to render shapes and how to add logic to shapes.
* Day 2: Begin implementing paddle movement/control as well as ball logic and movement.
* Day 3: Add bricks to the top of the screen and add point system for when a brick is hit and broken by ball.
* Day 4: Style and add any other smaller features that will make the play experience better/
* Day 5: Work on magnet power up.
* Day 6: Work on laser power up.
