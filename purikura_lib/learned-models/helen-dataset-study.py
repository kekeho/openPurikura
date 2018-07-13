import dlib, os, sys

options = dlib.simple_object_detector_training_options()
options.add_left_right_image_flips = False
options.C = 5 #c param
options.num_threads = 4 #cpu threads
options.be_verbose = True

train_xml_filename = './helen-dataset-formatted.xml'

print("Start training")
dlib.train_simple_object_detector(train_xml_filename, "helen-dataset.svm", options)

