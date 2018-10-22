PImage face_img;
String lines[];

void setup(){
    face_img = loadImage("/Users/hiroki/Documents/プログラミング/openPrikura/Tests/sources/Mona_Lisa.jpg");
    size(797, 1023);
    image(face_img, 0, 0);
    String annotation_file_name = "/Users/hiroki/Documents/プログラミング/openPrikura/Tests/sources/mona_lisa.txt";

    lines = loadStrings(annotation_file_name);
    
    
    for(int i=0;i<lines.length;i++){
        String point[] = split(lines[i], " ");
        int x = int(point[0]);
        int y = int(point[1]);
        
        text(str(i), x, y);
    }
}

void draw(){
  
  
}
