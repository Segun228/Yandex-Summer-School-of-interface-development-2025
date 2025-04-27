function solution(block) {
    const valueList = [];
    for (let i = 0; i < block.children.length; i++) {
        const value = parseInt(block.children[i].dataset.value, 10);
        if(!isNaN(value)){
            valueList.push(value);
        }
    }
    if(valueList.length < 2){
        return 0;}
    let minVal = Infinity;
    let maxVal = -Infinity;
    for(const value of valueList){
        if(value < minVal){
            minVal = value;
        }
        if(value > maxVal){
            maxVal = value;
        }
    }
    if(minVal === maxVal){
        return 0;
    }
    const bucketSize = Math.max(1, Math.floor((maxVal - minVal)/(valueList.length - 1)));
    const bucketCount = Math.floor((maxVal - minVal)/bucketSize) + 1;
    const buckets = new Array(bucketCount);
    for(let i=0; i<bucketCount; i++){
        buckets[i]={ min: Infinity, max: -Infinity, used: false };
    }
    for(const value of valueList){
        const index = Math.floor((value - minVal) / bucketSize);
        const bucket = buckets[index];
        bucket.min = Math.min(bucket.min, value);
        bucket.max = Math.max(bucket.max, value);
        bucket.used = true;
    }
    let maxDifference = 0;
    let predMax = minVal;
    for(const bucket of buckets){
        if (!bucket.used) continue;
        maxDifference = Math.max(maxDifference, bucket.min - predMax);
        predMax = bucket.max;
    }
    return maxDifference;
}