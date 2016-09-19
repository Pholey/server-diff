// let id = 0;
// export class Diff {
//   constructor(value, kind, description) {
//     this.value = value;
//     this.kind = kind;
//     this.id = id += 1;
//     this.description = description
//   }
// }
//
// const getKind = x => {
//   // Already has been processed and the kind has been determined
//   if (!(x instanceof Diff)) {
//     // Normalize the plain value into a Diff object
//     x = new Diff(x, null);
//   };
//
//   return {
//     kind: x.kind,
//     value: x.value,
//     id: x.id,
//     description: x.description,
//   }
// }
//
//
// export function model(data, name, props={}) {
//
//   if (_.isObject(data)) {
//     return _.map(data, (v, key) => {
//       let {kind, id, value, description} = getKind(v);
//
//       const baseProps = {id, kind, name: key, description, children: []}
//
//       let props
//       if (!_.isObject(value)) props = {...baseProps, size: 1}
//       else props = {...baseProps, children: model(value, key)}
//
//       return props;
//     });
//   }
//
//   return data;
// }

console.log("baaar")

onmessage = function(e) { console.log("replay") }

self.onmessage = function(e) {
  console.log("got message", e.data)
  //
  // if (!self.DeepDiff) {
  //   importScripts(e.data.url + "/www/deep-diff.js")
  // }
  //
  // var combinations = e.data.c;
  //
  //   var diffs = [];
  //   for (const diffed of self.DeepDiff.apply(null, c) {
  //     var type = diffed.kind;
  //
  //     // If this were to come down the pipe..
  //     var path = diffed.path.join("\0");
  //
  //     var d = new Diff(null, type, diffed);
  //
  //     // Save our diffs for later lookup
  //     setPropByString(all, path, d, "\0");
  //     diffs.push(diffed)
}

// export function setPropByString(obj, prop, value, delim="."){
//     // property not found
//     if(typeof obj === 'undefined') return false;
//
//     // index of next property split
//     var _index = prop.indexOf(delim)
//
//     // We got some more work to do
//     if(_index > -1){
//         // get the object, pass on the rest
//         return setPropByString(
//           obj[prop.substring(0, _index)],
//           prop.substr(_index+1),
//           value,
//           delim
//         );
//     }
//
//     // We have already set this prop
//     if (typeof obj[prop] === "string") return
//
//     // no split; set property
//     obj[prop] = value;
// }
