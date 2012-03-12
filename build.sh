
BASEDIR=$(dirname $0)
echo $BASEDIR/static/src/

python $BASEDIR/static/lib/closure-library/closure/bin/build/closurebuilder.py \
  --root=$BASEDIR/static/lib/closure-library/ \
  --root=$BASEDIR/static/src/ \
  --namespace="delphi.main" \
  --output_mode=compiled \
  --compiler_jar=$HOME/bin/compiler.jar \
  --compiler_flags="--flagfile=$BASEDIR/compiler.flags" | wc
