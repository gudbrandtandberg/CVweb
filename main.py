from flask import Flask, render_template, json, request, send_from_directory
app = Flask(__name__)

@app.route('/')
def home():
  return render_template('index.html', x=43)
  

if __name__ == '__main__':
  app.run()
