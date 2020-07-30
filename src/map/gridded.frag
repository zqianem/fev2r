// Fragment shader for the gridded data layer

precision mediump float;

#pragma glslify: p0 = require(./projections/equirectangular/invert.glsl)
#pragma glslify: p1 = require(./projections/mercator/invert.glsl)
#pragma glslify: p2 = require(./projections/equal-earth/invert.glsl)
#pragma glslify: p3 = require(./projections/orthographic/invert.glsl)

uniform float u_canvasRatio;
uniform float u_lon0;
uniform float u_lat0;
uniform float u_zoom;
uniform int u_projection;

uniform sampler2D u_texture;
varying vec2 v_position;

const float PI = radians(180.0);
const float PI_2 = radians(90.0);

void main() {
  // "display" coordinates are my convention here, where they correspond to
  // points on a graph with (0,0) in the center of the canvas, which is pi units
  // high when zoom = 1 and has width units proportional to height units (unlike
  // clip coordinates)
  vec2 displayCoord = vec2(u_canvasRatio * PI_2, PI_2) * v_position;
  displayCoord = displayCoord / u_zoom;

  // longitude and latitude, respectively, in degrees, where positive latitudes
  // correspond to the northern hemisphere, and positive longitudes are east of
  // the prime meridian -- these should be the outputs of the inverse map
  // projection equation for whichever projection we're currently using
  vec2 lonLat;

  // where the map is centered
  vec2 lonLat0 = radians(vec2(u_lon0, u_lat0));

  if (u_projection == 0) {
    p0(displayCoord, lonLat0, lonLat);
  } else if (u_projection == 1) {
    p1(displayCoord, lonLat0, lonLat);
  } else if (u_projection == 2) {
    p2(displayCoord, lonLat0, lonLat);
  } else if (u_projection == 3) {
    p3(displayCoord, lonLat0, lonLat);
  }

  // prevent textureCoord.x from overflowing by keeping longitude in [-PI, PI]
  lonLat.x = mod(lonLat.x + PI, 2.0 * PI) - PI;

  // also image needs to flipped vertically for some reason
  lonLat = lonLat * vec2(1, -1);

  // convert to texture coordinates on a image of a plate carrée map projection,
  // where (0,0) is the bottom left corner and (1,1) is the top right corner
  // (despite the image having an aspect ratio of 2:1, because that's just how
  // textures work in WebGL)
  vec2 textureCoord = (lonLat + vec2(PI, PI_2)) / vec2(2.0 * PI, PI);

  if (textureCoord.x <= 1.0 &&
      textureCoord.x >= 0.0 &&
      textureCoord.y <= 1.0 &&
      textureCoord.y >= 0.0) {
    gl_FragColor = texture2D(u_texture, textureCoord);
  } else {
    gl_FragColor = vec4(0, 0, 0, 0); // transparent
  }
}