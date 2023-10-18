# frozen_string_literal: true

require 'rails_helper'

RSpec.describe Api::V1::FieldsController, type: :controller do
  let!(:field1) { create(:field) }
  let!(:field2) { create(:field) }
  let(:coordinates) do
    [
      [36.86264965484389, 47.742295264025074],
      [36.86264965484389, 47.62979917281467],
      [37.12650505361714, 47.62979917281467],
      [37.12650505361714, 47.742295264025074],
      [36.86264965484389, 47.742295264025074]
    ]
  end

  describe 'GET #index' do
    before { get :index }

    it 'returns a successful JSON response' do
      expect(response).to be_successful
      expect(response.content_type).to eq('application/json; charset=utf-8')
    end

    it 'returns a list of fields' do
      parsed_response = JSON.parse(response.body)
      expect(parsed_response).to be_an_instance_of(Array)
      expect(parsed_response.size).to eq(2)
    end
  end

  describe 'GET #show' do
    before { get :show, params: { id: field1.id } }

    it 'returns a successful JSON response' do
      expect(response).to be_successful
      expect(response.content_type).to eq('application/json; charset=utf-8')
    end

    it 'returns the requested field' do
      parsed_response = JSON.parse(response.body)
      expect(parsed_response['id']).to eq(field1.id)
    end
  end

  describe 'POST #create' do
    context 'with valid parameters' do
      let(:valid_params) do
        {
          field: {
            name: 'test 1',
            coordinates:
          }
        }
      end

      before { post :create, params: valid_params, as: :json }

      it 'creates a new field' do
        expect(response).to have_http_status(:created)
        expect(Field.last.name).to eq('test 1')
      end

      it 'returns the created field' do
        parsed_response = JSON.parse(response.body)
        expect(parsed_response['name']).to eq('test 1')
      end
    end

    context 'with invalid parameters' do
      let(:invalid_params) do
        {
          field: {
            name: 'test 1',
            coordinates: []
          }
        }
      end

      before { post :create, params: invalid_params, as: :json }

      it 'returns unprocessable entity status' do
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'PATCH #update' do
    context 'with valid parameters' do
      let(:valid_params) do
        {
          name: 'Updated Field',
          coordinates:
        }
      end

      before { patch :update, params: { id: field1.id, field: valid_params }, as: :json }

      it 'updates the field' do
        expect(response).to have_http_status(:ok)
        field1.reload
        expect(field1.name).to eq('Updated Field')
      end

      it 'returns the updated field' do
        parsed_response = JSON.parse(response.body)
        expect(parsed_response['name']).to eq('Updated Field')
      end
    end

    context 'with invalid parameters' do
      let(:invalid_params) do
        {
          name: '',
          coordinates: []
        }
      end

      before { patch :update, params: { id: field1.id, field: invalid_params }, as: :json }

      it 'returns unprocessable entity status' do
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'DELETE #destroy' do
    context 'with a valid field id' do
      it 'destroys the field' do
        expect do
          delete :destroy, params: { id: field1.id }, as: :json
        end.to change(Field, :count).by(-1)
        expect(response).to have_http_status(:no_content)
      end
    end
  end

  describe 'GET #coordinates' do
    let(:fields) { Field.all }

    it 'returns JSON coordinates for all fields' do
      get :coordinates, as: :json

      expect(response).to have_http_status(:ok)
      parsed_response = JSON.parse(response.body)
      expect(parsed_response).to be_an(Array)
      expect(parsed_response.length).to eq(fields.length)

      parsed_response.each_with_index do |coordinates, index|
        field = fields[index]
        expected_coordinates = RGeo::GeoJSON.encode(field.shape)['coordinates'][0]
        expect(coordinates).to eq(expected_coordinates)
      end
    end

    context 'when there are no fields' do
      it 'returns an empty array' do
        Field.destroy_all

        get :coordinates, as: :json

        expect(response).to have_http_status(:ok)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response).to be_an(Array)
        expect(parsed_response).to be_empty
      end
    end
  end
end
