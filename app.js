// PRINCE CIPHER CODE
require('dotenv').config();

const hex_letters = ["0", "1","2","3","4","5","6","7","8","9","a","b","c","d","e","f"];
const binVal = ["0000", "0001", "0010", "0011", "0100", "0101", "0110", "0111", "1000", "1001", "1010", "1011", "1100", "1101", "1110", "1111"];
const roundConstants = ["0000000000000000", "13198a2e03707344","a4093822299f31d0", "082efa98ec4e6c89", "452821e638d01377", "be5466cf34e90c6c", "7ef84f78fd955cb1", "85840851f1ac43aa", "c882d32f25323c54", "64a51195e0e3610d", "d3b5a399ca0c2399", "c0ac29b7c97c50dd"]
const shiftNibbles = [0,5,10,15,4,9,14,3,8,13,2,7,12,1,6,11];

const sbox = [11, 15, 3, 2, 10, 12, 9, 1, 6, 7, 8, 0, 14, 5, 13, 4];

function hexToInt(hexString){
    return hex_letters.indexOf(hexString)
}

function intToHex(intVal){
    return (hex_letters[intVal])
}

function hexToBin(hexString){
    return binVal[hex_letters.indexOf(hexString)]
}

function makeBinString(hexString){
    let binString =""
    for (let i=0; i<16; i++){
        binString+=hexToBin(hexString[i])
    }
    return binString
}

function binListHexString(binList){
    let ansList=[]
    for (let i=0;i<binList.length;i++){
        ansList.push(binToHex(binList[i]))
    }
    let ansString= ansList.join('')
    return ansString
}

function binToHex(binString){
    return hex_letters[binVal.indexOf(binString)]
}

function substitution(inputHex){
    let resString=""
    for (let i=0;i<16;i++){
        resString+=intToHex(sbox[hexToInt(inputHex[i])])
    }
    return resString
}

function substitutionInverse(inputHex){
    let resString=""
    for (let j=0; j<16;j++){
        for (let i=0; i<16;i++){
            if (hexToInt(inputHex[j])==sbox[i]){
                resString+=intToHex(i)
                break
            }
        }
    }
    return resString
}

function keyWhitening(key){
    let k0 = key.slice(0,16)
    let k1 = key.slice(16,32)
    let k0_bin =makeBinString(k0)
    let k0_ = k0_bin[63]+k0_bin.slice(0,63)
    k0_ = k0_.slice(0,63)+ (parseInt(k0_[63])^parseInt(k0_bin[0])).toString()
    let k0_list = k0_.match(/.{1,4}/g);
    k0_=binListHexString(k0_list)
    return k0+k0_+k1
}

function roundXor(inputHex, round){
    let resString=""
    for (let i=0; i<16;i++){
        let resBit = hexToInt(inputHex[i])^hexToInt(roundConstants[round][i])
        resString+=intToHex(resBit)
    }
    return resString
}

function keyXor(inputHex, keyHex){
    let resString=""
    for (let i=0; i<16;i++){
        let resBit = hexToInt(inputHex[i])^hexToInt(keyHex[i])
        resString+=intToHex(resBit)
    }
    return resString
}

function shiftRows(inputHex){
    let resString=""
    for (let i=0;i<16;i++){
        resString+=inputHex[shiftNibbles[i]]
    }
    return resString
}

function shiftRowsInverse(inputHex){
    let resString=""
    for (let i=0;i<16;i++){
        resString+=inputHex[shiftNibbles.indexOf(i)]
    }
    return resString
}

function matrixLayer(inputHex){
    resList=[]

    mPrime=[[0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],       
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,1]]

    inputBin = makeBinString(inputHex)

    for (let i=0; i<inputBin.length; i++){
        mulResult = 0
        for (let j=0; j<64; j++){
            mulResult^=parseInt(inputBin[j])*mPrime[j][i]
        }
        
        resList.push(mulResult)
    }
    let binRes = []

    for (let k=0; k<64; k=k+4){
        let binValue=""
        for (let p=0;p<4;p++){
            binValue+=resList[k+p]
        }
        binRes.push(binValue)
    }

    return (binListHexString(binRes))
}

function commonEncDecFunction(plaintext, k0, k0Prime, k1){
    firstXor = keyXor(plaintext, k0)
    pCoreXor = keyXor(firstXor, k1)
    nextXor = roundXor(pCoreXor,0)

    for (let i=1;i<6;i++){
        subStep = substitution(nextXor)
        difStep = matrixLayer(subStep)
        nextDifStep = shiftRows(difStep)
        roundCStep = roundXor(nextDifStep, i)
        nextXor = keyXor(roundCStep, k1)
    }

    midSub = substitution(nextXor)
    matrixRes = matrixLayer(midSub)
    midSubInv = substitutionInverse(matrixRes)

    for (let j=6; j<11;j++){
        nextOp = keyXor(midSubInv, k1)
        roundCStep = roundXor(nextOp, j)
        shiftInv = shiftRowsInverse(roundCStep)
        difStep = matrixLayer(shiftInv)
        midSubInv = substitutionInverse(difStep)
    }

    lastRoundXor = roundXor(midSubInv, 11)
    lastKeyXor = keyXor(lastRoundXor, k1)
    afterCore = keyXor(lastKeyXor, k0Prime)
    return afterCore
}

function princeEncryption(plaintext, key){
    expandedKey = keyWhitening(key)
    k0 = expandedKey.slice(0,16)
    k0Prime = expandedKey.slice(16,32)
    k1=expandedKey.slice(32,48)
    encryption = commonEncDecFunction(plaintext, k0, k0Prime, k1)
    return encryption
}

function princeDecryption(ciphertext, key){
    expandedKey = keyWhitening(key)
    k0= expandedKey.slice(0,16)
    k0Prime = expandedKey.slice(16,32)
    k1=expandedKey.slice(32,48)

    new_k1=keyXor(k1, "c0ac29b7c97c50dd")

    decryption = commonEncDecFunction(ciphertext, k0Prime, k0, new_k1)
    return decryption
}


// PRINCE CIPHER CODE END


const express = require("express")
const ejs = require("ejs")
const session = require('express-session');
const bodyParser= require("body-parser")
const mongoose = require("mongoose");
const buffer = require('buffer')

const encKey = process.env.PRINCE_KEY;

const app = express()

var currentUser="";

app.set('view engine', 'ejs');

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: process.env.SESSION_SECRET
}));

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

// mongoose.connect("mongodb://0.0.0.0:27017/newconfessionsDB");

const connectionString = "mongodb+srv://user1:"+process.env.MONGO_PW+"@cluster0.ucoe8uq.mongodb.net/confessionsDB"

mongoose.connect(connectionString);

const userSchema = new mongoose.Schema({
    email: String,
    googleid: String,
    username: String,
    name: String,
    date: [Date],
    confessions : [String],
    status: [Number] //1 means read, 0 means unread
})

const User = mongoose.model("User", userSchema);

/*  PASSPORT SETUP  */

const passport = require('passport');
const { match } = require('assert');
var userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs');

app.get('/success', (req, res) => res.send(userProfile));
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

/*  Google AUTH  */
 
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));
 
app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    User.findOne({googleid: userProfile.id}, function(err, matchedUser){
        if (matchedUser==null){
            res.redirect("/register");
        }
        else{
            res.redirect('/');
        }
    })
  });

app.get("/", function(req, res){
    if (userProfile){
        User.findOne({googleid: userProfile.id}, function(err, matchedUser){
            currentUser = matchedUser.username;

            allConfessions=[];
            let userConfess = matchedUser.confessions;
            for (let c=0; c<userConfess.length; c++){
                let cipherText = userConfess[c];
                let actualMessage=""
                for (let d=0; d< cipherText.length/16; d++){
                    actualMessage+=princeDecryption(cipherText.slice(d*16, (d+1)*16), encKey)
                }
                for (let i=0; i<actualMessage.length; i=i+2){
                    if (actualMessage[i]==="0"){
                        if (actualMessage[i+1]==="0"){
                            actualMessage = actualMessage.slice(0,i);
                            break
                        }
                    }
                }
                let decoded = buffer.Buffer.from(actualMessage, 'hex').toString();
                allConfessions.push(decoded)
            }

            const currentStatus = matchedUser.status.reverse()
            const finalStatus = currentStatus.map(n => 1);

            User.updateOne({username: currentUser}, {status:finalStatus}, function(err){
                if (err){
                    console.log(err)
                }
            })

            res.render('secrets', {user: matchedUser.username, confessions:allConfessions.reverse(), dates:matchedUser.date.reverse()
                , status: currentStatus});
        })
    } else{
        res.render("home")
    }
})

app.get("/register", function(req, res){
    let defName = userProfile.displayName;
    res.render("register", {defaultName: defName, username:"", message:""})
})

app.post("/register", function(req, res){
    let username = req.body.username;
    let name = req.body.name;
    
    User.findOne({username: username}, function(err, matchedUser){
        if (matchedUser==null){
            const user= new User({
                email: userProfile.emails[0].value,
                googleid: userProfile.id,
                username: username,
                name: name,
                date: [],
                confessions: []
            })
            
            user.save();

            res.redirect("/")

        } else{
            let defName = userProfile.displayName;
            res.render("register", {defaultName: defName, username:username, message:"Username unavailable"})
        }
    })
})

// app.get("/login", function(req, res){
//     res.render("login", {message:""})
// })

// app.post("/login", function(req, res){
//     let username = req.body.username;
//     let password = req.body.password;

//     user = username;

//     User.findOne({email: username}, function(err, user){
//         if (err){
//             console.log(err);
//         } else{
//             bcrypt.compare(password, user.password, function(err, result){
//                 if (err){
//                     console.log(err);
//                 } else{
//                     if (result){
//                         res.render("secrets")
//                     } else{
//                         res.render("login", {message: "Wrong password, please try again."})
//                     }
//                 }
//             })
//         }
//     })
// })

app.get("/submit", function(req, res){
    if (userProfile){
        let names=[]
        User.find(function(err, users){
            for (let x=0;x<users.length;x++){
                if (users[x].username!=currentUser){
                    names.push(users[x].name + " ("+users[x].username+")");
                }
            }
            res.render("submit", {names:names})
        })
    } else{
        res.redirect("/")
    }
    
})

app.post("/submit", function(req, res){
    let target = req.body.target;
    let message = req.body.secret;

    let start = target.indexOf("(") + 1;
    let end = target.indexOf(")");

    let username = target.slice(start, end);

    let hexMessage = buffer.Buffer.from(message).toString('hex');
    
    while (hexMessage.length%16!=0){
        hexMessage+='0'
    }

    let encMessage = ""
    for (let j=0; j<hexMessage.length/16;j++){
        let messageToEnc = hexMessage.slice(j*16, (j+1)*16)
        encryption = princeEncryption(messageToEnc, encKey)
        encMessage+=encryption
    }

    User.findOne({username: username}, function(err, user){
        if (err){
            console.log(err)
        } else{
            let userConfess = user.confessions;
            let userDate = user.date
            let userStatus = user.status
            const dateObject = new Date();
            var date = dateObject.getFullYear()+"-"+(dateObject.getMonth()+1)+"-"+dateObject.getDate();

            userDate.push(date)
            userConfess.push(encMessage);
            userStatus.push(0)

            User.updateOne({username: username}, {confessions: userConfess, date: userDate, status:userStatus}, function(err){
                if (err){
                    console.log(err)
                }
            })
        }
    })
    res.redirect("/submitted")
})

app.get("/submitted", function(req, res){
    res.render("success")
})

// app.get("/confessions", function(req, res){
//     if (user==""){
//         res.render("login", {message: "To see your confessions, log in."})
//     } else{
//     allConfessions=[];
//     User.findOne({email: user}, function(err, matchedUser){
//         if (err){
//             console.log(err)
//         } else{
//             let userConfess = matchedUser.confessions;
//             for (let c=0; c<userConfess.length; c++){
//                 let cipherText = userConfess[c];
//                 let actualMessage=""
//                 for (let d=0; d< cipherText.length/16; d++){
//                     actualMessage+=princeDecryption(cipherText.slice(d*16, (d+1)*16), encKey)
//                 }
//                 for (let i=0; i<actualMessage.length; i=i+2){
//                     if (actualMessage[i]==="0"){
//                         if (actualMessage[i+1]==="0"){
//                             actualMessage = actualMessage.slice(0,i);
//                             break
//                         }
//                     }
//                 }
//                 let decoded = buffer.Buffer.from(actualMessage, 'hex').toString();
//                 allConfessions.push(decoded)
//             }

//             res.render("confessions", {confessions: allConfessions})
//         }
//     })
// }
// })

app.get("/logout", function(req, res){
    userProfile=null;
    res.redirect("/")
})

app.listen(process.env.PORT||3000, function(){
    console.log("Server is up on port 3000.")
})



