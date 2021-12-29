uniform vec3 uDepthColor;
uniform vec3 uSurFaceColor;
varying float vElevation;
uniform float uColorOffset;
uniform float uColorMultiplier;

void main(){
  float mixStrengh = (vElevation + uColorOffset) * uColorMultiplier;
  vec3 color = mix(uDepthColor,uSurFaceColor,mixStrengh);
  gl_FragColor = vec4(color,1.0);
}