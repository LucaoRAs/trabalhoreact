import pymysql
from db_config import connect_db
from flask import jsonify, request, Blueprint
from flask_cors import CORS

# Cria o blueprint e ativa CORS só para ele
veiculos_bp = Blueprint("veiculos", __name__)
CORS(veiculos_bp, origins=["http://localhost:3000"])

# GET todos os veículos
@veiculos_bp.route('/veiculos', methods=['GET'])
def listar_veiculos():
    try:
        conn = connect_db()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        cursor.execute("SELECT * FROM veiculos")
        rows = cursor.fetchall()
        return jsonify(rows), 200
    except Exception as e:
        print(e)
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# GET veículo por ID
@veiculos_bp.route('/veiculos/<id>', methods=['GET'])
def buscar_veiculo(id):
    try:
        conn = connect_db()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        cursor.execute("SELECT * FROM veiculos WHERE id = %s", (id,))
        row = cursor.fetchone()
        if row:
            return jsonify(row), 200
        else:
            return jsonify({'message': 'Veículo não encontrado'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# POST novo veículo
@veiculos_bp.route('/veiculos', methods=['POST'])
def criar_veiculo():
    try:
        conn = connect_db()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        data = request.json
        modelo = data['modelo']
        marca = data['marca']
        ano = data['ano']
        cor = data['cor']
        preco = data['preco']
        cursor.execute("""
            INSERT INTO veiculos (modelo, marca, ano, cor, preco) 
            VALUES (%s, %s, %s, %s, %s)
        """, (modelo, marca, ano, cor, preco))
        conn.commit()
        return jsonify({'message': 'Veículo cadastrado com sucesso'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# PUT atualizar veículo
@veiculos_bp.route('/veiculos/<id>', methods=['PUT'])
def atualizar_veiculo(id):
    try:
        conn = connect_db()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        data = request.json
        cursor.execute("""
            UPDATE veiculos 
            SET modelo = %s, marca = %s, ano = %s, cor = %s, preco = %s 
            WHERE id = %s
        """, (data['modelo'], data['marca'], data['ano'], data['cor'], data['preco'], id))
        conn.commit()
        return jsonify({'message': 'Veículo atualizado com sucesso'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# DELETE veículo
@veiculos_bp.route('/veiculos/<id>', methods=['DELETE'])
def deletar_veiculo(id):
    try:
        conn = connect_db()
        cursor = conn.cursor(pymysql.cursors.DictCursor)
        cursor.execute("DELETE FROM veiculos WHERE id = %s", (id,))
        conn.commit()
        return jsonify({'message': 'Veículo deletado com sucesso'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()
