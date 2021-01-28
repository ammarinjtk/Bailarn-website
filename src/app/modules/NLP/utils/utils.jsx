export function pad(x, sequence_length, pad_with) {
    var paded_x = [];
    for (var i = 0; i < x.length; i++) {
        var temp = x[i];

        if (x[i].length >= sequence_length) {
            var steps = Math.floor(temp.length / sequence_length);
            if (temp.length % sequence_length !== 0) {
                var extended = [];
                for (var j = 0; j < sequence_length * (steps + 1) - temp.length; j++) {
                    extended.push(pad_with);
                }
                temp.push.apply(temp, extended);
            } else {
                steps -= 1;
            }

            for (var step = 0; step < steps + 1; step++) {
                paded_x.push(
                    temp.slice(step * sequence_length, (step + 1) * sequence_length)
                );
            }
        } else {
            extended = [];
            for (j = 0; j < sequence_length - x[i].length; j++) {
                extended.push(pad_with);
            }
            temp.push.apply(temp, extended);
            paded_x.push(temp);
        }
    }
    return paded_x;
}

export function build_tag_index(lst, start_index = 1, reverse = false) {
    var index = {};
    var idx = start_index;
    for (var i = 0; i < lst.length; i++) {
        var key = lst[i];
        // Duplicate index (multiple key same index)
        if (key instanceof Array) {
            for (var j = 0; j < key.length; j++) {
                var k = key[j];
                if (reverse) {
                    index[idx] = k;
                } else {
                    index[k] = idx;
                }
            }
        } else {
            // Unique index
            if (reverse) {
                index[idx] = key;
            } else {
                // console.log(key, idx);
                index[key] = idx;
            }
        }
        idx += 1;
    }
    return index;
}

export function swap(json) {
    var ret = {};
    for (var key in json) {
        ret[json[key]] = key;
    }
    return ret;
}
