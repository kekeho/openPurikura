import dlib, os, sys
import multiprocessing

#set options
options = dlib.shape_predictor_training_options()
options.num_threads = multiprocessing.cpu_count() #cpu threads
options.be_verbose = True

train_xml_filename = './helen-dataset.xml'
test_xml_filename = './helen-dataset-test.xml'

print("Start training")
dlib.train_shape_predictor(train_xml_filename, "helen-dataset.dat", options)
print("Finish")